/* ============================================================================
 * app.js — Renderização da interface e edição ao vivo integrado com Firebase
 * ==========================================================================*/

import { carregarEstado, salvarEstado } from './storage.js';

// 1. Puxa as dependências globais (ficheiros não-módulos) para dentro do módulo
const TIMES = window.TIMES;
const ORDEM_GRUPOS = window.ORDEM_GRUPOS;
const JOGOS_GRUPO = window.JOGOS_GRUPO;
const KNOCKOUT = window.KNOCKOUT;
const KO_AGENDA = window.KO_AGENDA;
const FORCAS = window.FORCAS;
const OVER_UNDER = window.OVER_UNDER || {};
const CHAMP_ODDS = window.CHAMP_ODDS;
const SEED_RESULTS = window.SEED_RESULTS;
const classificacaoGrupo = window.classificacaoGrupo;
const jogosDisputadosGrupo = window.jogosDisputadosGrupo;
const grupoCompleto = window.grupoCompleto;
const montarBracket = window.montarBracket;
const restaurarOficial = window.restaurarOficial;
const limparTudo = window.limparTudo;
const baixarBackup = window.baixarBackup;
const lerBackup = window.lerBackup;

const $ = sel => document.querySelector(sel);

const DESTAQUE = 'BRA';                 // seleção destacada no chaveamento (caminho do Brasil)
const ddmm = iso => iso.slice(8) + '/' + iso.slice(5,7);

/* Cores dos cabeçalhos de grupo (inspiradas na arte oficial de grupos da FIFA 2026) */
const GRUPO_COR = {
  A:'#1a9e4b', B:'#d3243a', C:'#1a9e4b', D:'#1f5fc0',
  E:'#d39a1c', F:'#e8731c', G:'#6a2fb0', H:'#14a89a',
  I:'#c0246a', J:'#1f5fc0', K:'#14a89a', L:'#6a2fb0',
};

function flagImg(teamId){
  const t = TIMES[teamId];
  return `<img class="flag" src="https://flagcdn.com/w40/${t.flag}.png" alt="" loading="lazy"
            onerror="this.style.display='none'">`;
}

/* ---------------- GRUPOS ---------------- */
function renderGrupos(){
  const html = ORDEM_GRUPOS.map(g => {
    const cls = classificacaoGrupo(g, estado.placares);
    const nj = jogosDisputadosGrupo(g, estado.placares);

    const linhas = cls.map(s => {
      let rowCls = s.pos <= 2 ? 'row-q' : (s.pos === 3 ? 'row-3' : '');
      if (s.id === DESTAQUE) rowCls += ' row-destaque';
      const tie = s.empateNaoResolvido
        ? ' <span class="tie-warn" title="Empate só resolvido por fair play / ranking FIFA">≈</span>' : '';
      return `<tr class="${rowCls}">
        <td><span class="pos-pill">${s.pos}</span></td>
        <td class="time">${flagImg(s.id)}${TIMES[s.id].nome}${tie}</td>
        <td class="pts">${s.pts}</td>
        <td>${s.j}</td><td>${s.v}</td><td>${s.e}</td><td>${s.d}</td>
        <td>${s.gp}</td><td>${s.gc}</td><td>${s.sg > 0 ? '+' + s.sg : s.sg}</td>
      </tr>`;
    }).join('');

    const jogos = JOGOS_GRUPO.filter(j => j[1] === g).map(([id, gg, m, v, data]) => {
      const p = estado.placares[id];
      const dia = data.slice(8) + '/' + data.slice(5,7);
      return `<div class="jogo-row">
        <span class="data">${dia}</span>
        <span class="lado casa">${TIMES[m].nome} ${flagImg(m)}</span>
        <input class="score-in" type="number" min="0" inputmode="numeric"
               data-jogo="${id}" data-lado="m" data-focus="g:${id}:m"
               value="${p ? p[0] : ''}">
        <span class="x">×</span>
        <input class="score-in" type="number" min="0" inputmode="numeric"
               data-jogo="${id}" data-lado="v" data-focus="g:${id}:v"
               value="${p ? p[1] : ''}">
        <span class="lado fora">${flagImg(v)} ${TIMES[v].nome}</span>
      </div>`;
    }).join('');

    return `<div class="grupo-card">
      <div class="grupo-head" style="background-color:${GRUPO_COR[g]}"><h3>Grupo ${g}</h3><span class="badge">${nj}/6 jogos</span></div>
      <table class="tabela">
        <thead><tr><th>#</th><th class="time">Seleção</th><th>P</th><th>J</th>
          <th>V</th><th>E</th><th>D</th><th>GP</th><th>GC</th><th>SG</th></tr></thead>
        <tbody>${linhas}</tbody>
      </table>
      <div class="jogos-list">${jogos}</div>
    </div>`;
  }).join('');

  $('#grupos-grid').innerHTML = html;
}

/* ---------------- BRACKET ----------------
   Ordem das colunas (esquerda → direita), espelhadas com a final no centro. */
const COLUNAS = [
  {title:'16 avos de final', lado:'left',   ids:[74,77,73,75,83,84,81,82]},
  {title:'Oitavas de final', lado:'left',   ids:[89,90,93,94]},
  {title:'Quartas de final', lado:'left',   ids:[97,98]},
  {title:'Semifinal',        lado:'left',   ids:[101]},
  {title:'Final',            lado:'center', ids:[104]},
  {title:'Semifinal',        lado:'right',  ids:[102]},
  {title:'Quartas de final', lado:'right',  ids:[99,100]},
  {title:'Oitavas de final', lado:'right',  ids:[91,92,95,96]},
  {title:'16 avos de final', lado:'right',  ids:[76,78,79,80,86,88,85,87]},
];

function slotHTML(slot, m, lado){
  const isVenc = m.vencedorId && m.vencedorId === slot.id;
  const cls = 'slot' + (slot.id ? ' clicavel' : ' placeholder') + (isVenc ? ' vencedor' : '')
            + (slot.id === DESTAQUE ? ' destaque' : '');
  const clicavel = !!slot.id;        
  const nome = slot.id
    ? (flagImg(slot.id) + '<span class="nome sigla" title="' + TIMES[slot.id].nome + '">' + slot.id +
       '</span><span class="spacer"></span>' + (isVenc ? '<span class="check">✓</span>' : ''))
    : ('<span class="nome">' + slot.label + '</span>');
  const attrs = clicavel
    ? ` data-ko="${m.id}" data-venc="${slot.id}" title="Clique para avançar ${TIMES[slot.id].nome}"`
    : '';
  return `<div class="${cls}"${attrs}>${nome}</div>`;
}

function matchHTML(id, bk, opts){
  opts = opts || {};
  const m = bk.jogos[id];
  const temDest = (m.casa.id === DESTAQUE || m.fora.id === DESTAQUE);
  const cls = 'match' + (m.prov ? ' prov' : '') + (opts.final ? ' final-card' : '')
            + (temDest ? ' tem-destaque' : '');
  const ag = KO_AGENDA[id];
  const quando = ag ? `${ddmm(ag.data)} · ${ag.local}` : '';
  const head = opts.final ? `FINAL · ${quando}` : `#${id} · ${quando}`;
  return `<div class="${cls}">
    <div class="minner">
      <div class="mhead">${head}</div>
      ${slotHTML(m.casa, m, 'm')}
      ${slotHTML(m.fora, m, 'v')}
    </div>
  </div>`;
}

function renderBracket(){
  const bk = montarBracket(estado.placares, estado.ko);

  const completo = bk.terceiros.completo;
  const dicaClique = ' &nbsp;👆 <b>Clique num time</b> para avançá-lo (clique de novo para desfazer).';
  $('#ko-aviso').innerHTML = (completo
    ? '✅ Todos os grupos encerrados — chaveamento definido conforme os parâmetros da FIFA.'
    : '⏳ Projeção <b>ao vivo</b>: as vagas (incl. os "melhores 3º") só ficam definitivas quando os 72 jogos de grupo terminarem. As vagas tracejadas são provisórias.')
    + dicaClique;

  const cols = COLUNAS.map(col => {
    const ehFinal = col.lado === 'center';
    const first = col.ids.length === 8;            
    const hasPairs = col.ids.length > 1;
    const mws = col.ids.map(id =>
      `<div class="mw">${matchHTML(id, bk, {final: ehFinal})}</div>`).join('');
    const cls = 'round ' + col.lado + (hasPairs ? ' has-pairs' : '') + (first ? ' first' : '');
    return `<div class="${cls}">
      <div class="round-title">${col.title}</div>
      <div class="matches">${mws}</div>
    </div>`;
  }).join('');
  $('#bracket').innerHTML = cols;

  const champ = bk.jogos[104].vencedorId;
  const campeao = champ
    ? `<div class="campeao"><div class="lbl">🏆 Campeão</div>
         <div class="nome">${flagImg(champ)}${TIMES[champ].nome}</div></div>`
    : '';
  $('#bracket-extra').innerHTML = campeao +
    `<div class="terceiro-box">
       <div class="round-title">Disputa de 3º lugar · ${ddmm(KO_AGENDA[103].data)}</div>
       ${matchHTML(103, bk)}
     </div>`;
}

/* ---------------- RENDER + foco ---------------- */
function renderTudo(){
  const ativo = document.activeElement;
  const foco = ativo && ativo.dataset ? ativo.dataset.focus : null;
  const caret = ativo && ativo.selectionStart;

  renderGrupos();
  renderBracket();

  if (foco){
    const el = document.querySelector(`[data-focus="${foco}"]`);
    if (el){ el.focus(); try { el.setSelectionRange(caret, caret); } catch(e){} }
  }
}

/* ---------------- SIMULAÇÃO ---------------- */
function simularResto(){
  JOGOS_GRUPO.forEach(([id, , casa, fora]) => {
    if (!estado.placares[id]) estado.placares[id] = golsPorOdds(casa, fora, OVER_UNDER[id]);
  });
  KNOCKOUT.slice().sort((a, b) => a.id - b.id).forEach(ko => {
    const bk = montarBracket(estado.placares, estado.ko);
    const m = bk.jogos[ko.id];
    if (!m.casa.id || !m.fora.id || m.decidido) return;   
    estado.ko[ko.id] = { venc: vencedorPorOdds(m.casa.id, m.fora.id) };
  });
  salvarEstado(estado);
  renderTudo();
}

/* ---------------- PROJEÇÃO PELAS ODDS ---------------- */
const forca = id => Math.log(1 / (CHAMP_ODDS[id] || 1000));

function poisson(lambda){
  const L = Math.exp(-lambda);
  let k = 0, p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return k - 1;
}

const _sig   = z => 1 / (1 + Math.exp(-z));
const _logit = x => { x = Math.min(0.999, Math.max(0.001, x)); return Math.log(x / (1 - x)); };

function golsPorOdds(idCasa, idFora, ouLine){
  const ALPHA = 0.8;
  const fc = FORCAS[idCasa] || {gf:1.2, ga:1.2};
  const ff = FORCAS[idFora] || {gf:1.2, ga:1.2};
  const baseC = (fc.gf + ff.ga) / 2;            
  const baseF = (ff.gf + fc.ga) / 2;            
  const total = ouLine || (baseC + baseF);      
  const d = forca(idCasa) - forca(idFora);
  const share = _sig(_logit(baseC / (baseC + baseF)) + ALPHA * d);  
  const lc = Math.min(4.5, Math.max(0.12, total * share));
  const lf = Math.min(4.5, Math.max(0.12, total * (1 - share)));
  return [poisson(lc), poisson(lf)];
}

function vencedorPorOdds(idCasa, idFora){
  const K = 0.9;
  const p = 1 / (1 + Math.exp(-K * (forca(idCasa) - forca(idFora))));
  return (Math.random() < p) ? idCasa : idFora;
}

function preencherPelasOdds(){
  JOGOS_GRUPO.forEach(([id, , casa, fora]) => {
    if (SEED_RESULTS[id]) return;            
    estado.placares[id] = golsPorOdds(casa, fora, OVER_UNDER[id]);
  });
  salvarEstado(estado);
  renderTudo();
}

/* ---------------- EVENTOS ---------------- */
function lerInt(v){
  if (v === '' || v == null) return null;
  const n = parseInt(v, 10);
  return (isNaN(n) || n < 0) ? null : n;
}

document.addEventListener('input', (ev) => {
  const el = ev.target;

  if (el.classList.contains('score-in')){           
    const id = el.dataset.jogo;
    const ins = document.querySelectorAll(`.score-in[data-jogo="${id}"]`);
    const gm = lerInt([...ins].find(i => i.dataset.lado === 'm').value);
    const gv = lerInt([...ins].find(i => i.dataset.lado === 'v').value);
    if (gm != null && gv != null) estado.placares[id] = [gm, gv];
    else delete estado.placares[id];
    salvarEstado(estado); renderTudo();
  }
});

document.addEventListener('click', (ev) => {
  const slot = ev.target.closest('.slot.clicavel[data-ko]');
  if (slot){
    const id = slot.dataset.ko, time = slot.dataset.venc;
    if (estado.ko[id] && estado.ko[id].venc === time) delete estado.ko[id];
    else estado.ko[id] = { venc: time };
    salvarEstado(estado); renderTudo();
  }
});

$('#btn-odds').addEventListener('click', () => {
  if (confirm('Preencher os jogos de grupo que ainda não aconteceram com base nas odds das casas de aposta?\n(os 24 jogos já disputados são mantidos · clique de novo para um novo cenário)')){
    preencherPelasOdds();
  }
});
$('#btn-simular').addEventListener('click', () => {
  if (confirm('Preencher TODOS os jogos restantes (grupos e mata-mata) com placares aleatórios?')){
    simularResto();
  }
});
$('#btn-restaurar').addEventListener('click', () => {
  if (confirm('Restaurar os placares oficiais (1ª rodada) e apagar suas edições?\n(o bolão 7RD BET é preservado)')){
    estado = restaurarOficial(estado); renderTudo();
  }
});
$('#btn-limpar').addEventListener('click', () => {
  if (confirm('Limpar TODOS os placares (grupos e mata-mata)?\n(o bolão 7RD BET é preservado)')){
    estado = limparTudo(estado); renderTudo();
  }
});

// Backup em arquivo (.json) — baixar e restaurar
$('#btn-backup').addEventListener('click', () => baixarBackup(estado));
$('#btn-restore').addEventListener('click', () => $('#file-backup').click());
$('#file-backup').addEventListener('change', (e) => {
  const f = e.target.files[0];
  if (f && confirm('Restaurar este backup vai SUBSTITUIR os dados atuais. Continuar?')){
    lerBackup(f, (st) => { estado = st; renderTudo(); });
  }
  e.target.value = '';
});

/* ---------------- INICIALIZAÇÃO FIREBASE ---------------- */
let estado;

carregarEstado((dados) => {
  estado = dados;
  renderTudo(); 
});
