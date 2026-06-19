/* ============================================================================
 * bracket.js — Resolve o mata-mata "ao vivo"
 *  A partir dos placares de grupo (classificações + 3º colocados) e dos
 *  resultados de mata-mata já lançados, descobre quem ocupa cada vaga dos
 *  jogos 73→104 e propaga os vencedores rodada a rodada.
 *
 *  Cada vaga pode estar: definida (grupo encerrado / jogo decidido) ou
 *  provisória (mostra quem ocuparia AGORA, mas o grupo/jogo ainda não acabou).
 * ==========================================================================*/

function _rotuloPos(ref){
  return (ref.pos === 1 ? '1º ' : '2º ') + 'Grupo ' + ref.g;
}

/* Monta o estado completo do mata-mata.
   placares: {idJogoGrupo:[gm,gv]}   koState: {idJogo:{venc:idDoTime}} (vencedor por clique) */
function montarBracket(placares, koState){
  const cls = {};
  ORDEM_GRUPOS.forEach(g => cls[g] = classificacaoGrupo(g, placares));
  const terc = rankearTerceiros(placares);
  const map = {};

  function resolveSlot(ref){
    if (ref.t === 'pos'){
      const s = cls[ref.g][ref.pos - 1];
      return { id: s ? s.id : null, prov: !grupoCompleto(ref.g, placares), label: _rotuloPos(ref) };
    }
    if (ref.t === 'terceiro'){
      if (terc.alocacao && terc.alocacao[ref.jogo]){
        const g = terc.alocacao[ref.jogo];
        const s = cls[g][2];
        // provisório enquanto a fase de grupos não terminar
        return { id: s ? s.id : null, prov: !terc.completo, label: '3º Grupo ' + g };
      }
      const slot = THIRD_SLOTS.find(x => x.jogo === ref.jogo);
      return { id: null, prov: true, label: 'Melhor 3º (' + slot.grupos.join('/') + ')' };
    }
    if (ref.t === 'vencedor'){
      const m = map[ref.jogo];
      if (m && m.vencedorId) return { id: m.vencedorId, prov: m.prov, label: 'Vencedor #' + ref.jogo };
      return { id: null, prov: true, label: 'Vencedor #' + ref.jogo };
    }
    if (ref.t === 'perdedor'){
      const m = map[ref.jogo];
      if (m && m.perdedorId) return { id: m.perdedorId, prov: m.prov, label: 'Perdedor #' + ref.jogo };
      return { id: null, prov: true, label: 'Perdedor #' + ref.jogo };
    }
    return { id: null, prov: true, label: '?' };
  }

  // Ordem crescente de id garante que dependências (vencedores) já foram calculadas
  KNOCKOUT.slice().sort((a, b) => a.id - b.id).forEach(ko => {
    const casa = resolveSlot(ko.casa);
    const fora = resolveSlot(ko.fora);
    const res  = (koState && koState[ko.id]) || null;
    const prov = casa.prov || fora.prov;

    // Vencedor escolhido por clique. Só vale se for um dos dois times atuais do confronto
    // (assim, se o confronto mudar por propagação/reset, a escolha antiga é ignorada).
    let vencedorId = null, perdedorId = null, decidido = false;
    if (res && res.venc && casa.id && fora.id && (res.venc === casa.id || res.venc === fora.id)){
      vencedorId = res.venc;
      perdedorId = (res.venc === casa.id ? fora.id : casa.id);
      decidido = true;
    }

    map[ko.id] = {
      id: ko.id, fase: ko.fase, lado: ko.lado,
      casa, fora, res, vencedorId, perdedorId, decidido, prov,
    };
  });

  return { jogos: map, classificacoes: cls, terceiros: terc };
}

/* Texto de exibição de uma vaga (nome do time ou rótulo do placeholder) */
function rotuloVaga(slot){
  if (slot.id) return TIMES[slot.id].nome;
  return slot.label;
}
