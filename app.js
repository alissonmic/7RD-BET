/* ============================================================================
 * app.js — Renderização da interface e edição ao vivo
 * ==========================================================================*/

import { carregarEstado, salvarEstado } from './storage.js';

// Puxa as dependências globais (arquivos não-módulos) para dentro do módulo
const TIMES = window.TIMES;
const ORDEM_GRUPOS = window.ORDEM_GRUPOS;
const JOGOS_GRUPO = window.JOGOS_GRUPO;
const KO_AGENDA = window.KO_AGENDA;
const classificacaoGrupo = window.classificacaoGrupo;
const jogosDisputadosGrupo = window.jogosDisputadosGrupo;
const grupoCompleto = window.grupoCompleto;
const montarBracket = window.montarBracket;
const restaurarOficial = window.restaurarOficial;
const limparTudo = window.limparTudo;
const baixarBackup = window.baixarBackup;
const lerBackup = window.lerBackup;

let estado;

const $ = sel => document.querySelector(sel);

const DESTAQUE = 'BRA';
const ddmm = iso => iso.slice(8) + '/' + iso.slice(5,7);

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

// ... [MANTENHA AQUI TODO O SEU CÓDIGO DE renderGrupos, renderBracket, etc.] ...

// INICIALIZAÇÃO
carregarEstado((dados) => {
  estado = dados;
  renderTudo(); 
});
