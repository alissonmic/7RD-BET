/* ============================================================================
 * thirds-table.js — Alocação dos 8 melhores terceiros aos 16 avos de final
 *
 * A FIFA publica (Anexo C do regulamento) uma tabela com 495 combinações — uma
 * para cada conjunto possível de 8 grupos (entre os 12) que classificam um 3º.
 * Cada jogo dos 16 avos só aceita um 3º colocado vindo de um conjunto fixo de
 * grupos (ver THIRD_SLOTS em data.js):
 *      74:A/B/C/D/F  77:C/D/F/G/H  79:C/E/F/H/I  80:E/H/I/J/K
 *      81:B/E/F/I/J  82:A/E/H/I/J  85:E/F/G/I/J  87:D/E/I/J/L
 *
 * Em vez de embutir as 495 linhas, resolvemos o EMPARELHAMENTO BIPARTIDO:
 * dados os 8 grupos classificados, atribuímos cada grupo a um jogo cujo conjunto
 * permitido o contém, de forma bijetiva. O resultado respeita 100% os parâmetros
 * de confronto definidos pela FIFA (inclusive a regra de não revanche com o
 * vencedor do próprio grupo, já embutida nos conjuntos permitidos).
 *
 * A busca é determinística (ordem fixa de jogos e grupos), então a mesma
 * combinação de grupos sempre gera o mesmo chaveamento. Quando há mais de um
 * emparelhamento válido, escolhemos o primeiro em ordem — fiel às restrições
 * publicadas (pode diferir do Anexo C apenas na escolha entre arranjos válidos).
 * ==========================================================================*/

/* Recebe a lista (até 8) de grupos cujos 3º colocados se classificaram.
   Retorna { jogo: grupo } ou null se não houver emparelhamento completo. */
function alocarTerceiros(gruposClassificados) {
  const slots = THIRD_SLOTS;                 // ordem fixa dos 8 jogos
  const grupos = gruposClassificados.slice().sort();  // ordem alfabética determinística
  if (grupos.length !== slots.length) return null;

  const resultado = {};
  const usados = {};

  function backtrack(i) {
    if (i === slots.length) return true;
    const slot = slots[i];
    for (const g of grupos) {
      if (usados[g]) continue;
      if (slot.grupos.indexOf(g) === -1) continue;  // grupo não permitido neste jogo
      usados[g] = true;
      resultado[slot.jogo] = g;
      if (backtrack(i + 1)) return true;
      usados[g] = false;
      delete resultado[slot.jogo];
    }
    return false;
  }

  return backtrack(0) ? resultado : null;
}
