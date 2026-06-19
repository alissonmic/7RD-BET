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
