/* ============================================================================
 * standings.js — Classificação dos grupos e ranking dos 3º colocados
 *  Critérios de desempate (regulamento FIFA, em ordem):
 *   1) Pontos  2) Saldo de gols  3) Gols marcados
 *   4) Confronto direto entre os empatados: pontos, saldo, gols
 *   5) Fair play / ranking FIFA (sem dados aqui → mantém ordem, sinaliza empate)
 * ==========================================================================*/

function _novoStat(id){
  return {id, j:0, v:0, e:0, d:0, gp:0, gc:0, sg:0, pts:0};
}

/* Calcula estatísticas de um grupo a partir do mapa de placares {idJogo:[gm,gv]} */
function estatisticasGrupo(grupo, placares){
  const stats = {};
  GRUPOS[grupo].forEach(id => stats[id] = _novoStat(id));

  JOGOS_GRUPO.forEach(([id, g, m, v]) => {
    if (g !== grupo) return;
    const p = placares[id];
    if (!p) return;                 // jogo ainda não disputado
    const [gm, gv] = p;
    const sm = stats[m], sv = stats[v];
    sm.j++; sv.j++;
    sm.gp += gm; sm.gc += gv; sv.gp += gv; sv.gc += gm;
    if (gm > gv){ sm.v++; sv.d++; sm.pts += 3; }
    else if (gm < gv){ sv.v++; sm.d++; sv.pts += 3; }
    else { sm.e++; sv.e++; sm.pts++; sv.pts++; }
  });
  Object.values(stats).forEach(s => s.sg = s.gp - s.gc);
  return stats;
}

/* Confronto direto: mini-tabela considerando só os jogos entre os times do subconjunto */
function _statsConfrontoDireto(ids, grupo, placares){
  const set = new Set(ids);
  const st = {};
  ids.forEach(id => st[id] = _novoStat(id));
  JOGOS_GRUPO.forEach(([id, g, m, v]) => {
    if (g !== grupo) return;
    if (!set.has(m) || !set.has(v)) return;
    const p = placares[id];
    if (!p) return;
    const [gm, gv] = p;
    st[m].gp += gm; st[m].gc += gv; st[v].gp += gv; st[v].gc += gm;
    if (gm > gv) st[m].pts += 3; else if (gm < gv) st[v].pts += 3;
    else { st[m].pts++; st[v].pts++; }
  });
  ids.forEach(id => st[id].sg = st[id].gp - st[id].gc);
  return st;
}

/* Compara dois stats pelos critérios globais (pts, sg, gp). 0 = empatados nesses critérios. */
function _cmpGlobal(a, b){
  return (b.pts - a.pts) || (b.sg - a.sg) || (b.gp - a.gp);
}

/* Classificação ordenada de um grupo. Marca posições e empates não resolvidos. */
function classificacaoGrupo(grupo, placares){
  const stats = estatisticasGrupo(grupo, placares);
  let arr = Object.values(stats);

  arr.sort((a, b) => _cmpGlobal(a, b) || a.id.localeCompare(b.id));

  // Desempate por confronto direto entre os que continuam iguais em pts/sg/gp
  arr.sort((a, b) => {
    const g = _cmpGlobal(a, b);
    if (g !== 0) return g;
    const cd = _statsConfrontoDireto([a.id, b.id], grupo, placares);
    const ca = cd[a.id], cb = cd[b.id];
    return (cb.pts - ca.pts) || (cb.sg - ca.sg) || (cb.gp - ca.gp) || a.id.localeCompare(b.id);
  });

  // Marca posição e se houve empate total com o vizinho (precisaria de fair play/ranking)
  arr.forEach((s, i) => {
    s.pos = i + 1;
    s.empateNaoResolvido = false;
  });
  for (let i = 0; i < arr.length - 1; i++){
    const a = arr[i], b = arr[i+1];
    if (_cmpGlobal(a, b) === 0){
      const cd = _statsConfrontoDireto([a.id, b.id], grupo, placares);
      if (_cmpGlobal(cd[a.id], cd[b.id]) === 0){
        a.empateNaoResolvido = true; b.empateNaoResolvido = true;
      }
    }
  }
  return arr;
}

/* Quantos jogos de um grupo já foram disputados (0..6) */
function jogosDisputadosGrupo(grupo, placares){
  return JOGOS_GRUPO.filter(([id, g]) => g === grupo && placares[id]).length;
}
function grupoCompleto(grupo, placares){ return jogosDisputadosGrupo(grupo, placares) === 6; }
function todosGruposCompletos(placares){ return ORDEM_GRUPOS.every(g => grupoCompleto(g, placares)); }

/* Ranking dos 12 terceiros colocados + alocação dos 8 melhores aos jogos dos 16 avos */
function rankearTerceiros(placares){
  const terceiros = ORDEM_GRUPOS.map(g => {
    const s = classificacaoGrupo(g, placares)[2];   // 3º colocado
    return Object.assign({}, s, {grupo:g});
  });

  terceiros.sort((a, b) => _cmpGlobal(a, b) || a.grupo.localeCompare(b.grupo));
  terceiros.forEach((t, i) => t.rank = i + 1);

  const top8 = terceiros.slice(0, 8);
  const gruposTop8 = top8.map(t => t.grupo);
  const completo = todosGruposCompletos(placares);
  // Aloca SEMPRE (mesmo provisoriamente) para que os 3º atuais já apareçam no chaveamento
  const alocacao = alocarTerceiros(gruposTop8);

  return { ranking: terceiros, top8, gruposTop8, alocacao, completo };
}
