/* ============================================================================
 * bet.js — Aba "7RD BET" (bolão da fase de grupos)
 *  - jogosDeAposta(): escolhe o(s) "jogo(s) do dia" conforme as regras
 *  - pontos(palpite, real): pontuação detalhada de um palpite
 *  - rankingBolao(bet): tabela do ranking somando os pontos de todos os jogos
 * ==========================================================================*/

// info rápida (grupo/mandante/visitante) de cada jogo de grupo
const _JOGO_INFO = {};
JOGOS_GRUPO.forEach(([id, g, m, v]) => { _JOGO_INFO[id] = { grupo:g, mandante:m, visitante:v }; });

const _ehBrasil = id => _JOGO_INFO[id] &&
  (_JOGO_INFO[id].mandante === 'BRA' || _JOGO_INFO[id].visitante === 'BRA');
const _minutos = h => { const [a,b] = h.split(':').map(Number); return a*60 + b; };
const _diaSemana = d => { const [y,mo,da] = d.split('-').map(Number); return new Date(y, mo-1, da).getDay(); }; // 0=dom..6=sáb

/* Lista de jogos de aposta (ordenada por data/hora). Regras:
   - dia útil (seg–sex): o(s) jogo(s) mais próximo(s) das 13h BRT (empate de horário ⇒ todos)
   - todos os jogos do BRASIL entram sempre (qualquer dia/horário)
   - fim de semana (sáb/dom): só jogos do Brasil */
function jogosDeAposta(){
  const porDia = {};
  Object.keys(HORARIOS).forEach(id => {
    const { d, h } = HORARIOS[id];
    (porDia[d] = porDia[d] || []).push({ id, min:_minutos(h) });
  });

  const sel = [];
  Object.keys(porDia).forEach(d => {
    const jogos = porDia[d];
    const fimDeSemana = (_diaSemana(d) === 0 || _diaSemana(d) === 6);
    const escolhidos = new Set();

    jogos.forEach(j => { if (_ehBrasil(j.id)) escolhidos.add(j.id); });   // Brasil sempre

    if (!fimDeSemana){                                                    // mais perto das 13h
      const alvo = 13 * 60;
      const menorDist = Math.min(...jogos.map(j => Math.abs(j.min - alvo)));
      jogos.forEach(j => { if (Math.abs(j.min - alvo) === menorDist) escolhidos.add(j.id); });
    }
    escolhidos.forEach(id => sel.push({ id, d, h:HORARIOS[id].h, min:_minutos(HORARIOS[id].h) }));
  });
  sel.sort((a,b) => a.d.localeCompare(b.d) || a.min - b.min || a.id.localeCompare(b.id));
  return sel;
}

/* Pontuação detalhada (escolha do usuário):
   - placar EXATO = 10
   - senão: vencedor certo + saldo certo = 7 · só vencedor = 5 · (+1 por placar de time acertado)
   Ex.: palpite 2x1, real 2x3 → vencedor errado (0) + mandante 2==2 (+1) = 1.  Idêntico = 10. */
function pontos(palpite, real){
  if (!palpite || !real) return null;
  const [pm, pv] = palpite, [rm, rv] = real;
  if (pm == null || pv == null || rm == null || rv == null) return null;  // palpite/resultado incompleto
  if (pm === rm && pv === rv) return 10;
  const sinal = x => (x > 0 ? 1 : (x < 0 ? -1 : 0));
  let p = 0;
  if (sinal(pm - pv) === sinal(rm - rv)) p += ((pm - pv) === (rm - rv)) ? 7 : 5;
  if (pm === rm) p += 1;
  if (pv === rv) p += 1;
  return p;
}

/* Ranking: soma de pontos por apostador + nº de cravadas (placar exato) + jogos palpitados */
function rankingBolao(bet){
  const jogos = jogosDeAposta();
  const tab = (bet.apostadores || []).map(nome => {
    let pts = 0, cravadas = 0, palpitados = 0;
    jogos.forEach(j => {
      const palp = bet.palpites[j.id] && bet.palpites[j.id][nome];
      if (palp && palp[0] != null && palp[1] != null) palpitados++;   // só conta palpite completo
      const pp = pontos(palp, bet.resultados[j.id]);
      if (pp != null){ pts += pp; if (pp === 10) cravadas++; }
    });
    return { nome, pts, cravadas, palpitados };
  });
  tab.sort((a,b) => b.pts - a.pts || b.cravadas - a.cravadas || a.nome.localeCompare(b.nome));
  tab.forEach((r,i) => r.pos = i + 1);
  return tab;
}
