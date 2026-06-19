/* ============================================================================
 * storage.js — Estado da aplicação + persistência em localStorage
 *  state = { placares:{idJogoGrupo:[gm,gv]}, ko:{idJogo:{venc}}, bet:{...} }
 *  - Sem nada salvo → inicia com os placares oficiais (seed.js)
 *  - Toda edição é gravada no navegador (sobrevive ao recarregar a página)
 * ==========================================================================*/

const STORAGE_KEY = 'copa2026_chaveamento_v1';

function _seedPlacares(){
  const p = {};
  Object.keys(SEED_RESULTS).forEach(id => p[id] = SEED_RESULTS[id].slice());
  return p;
}

// estado do bolão (7RD BET)
function _betVazio(){ return { apostadores: [], palpites: {}, resultados: {} }; }

// normaliza um estado vindo do localStorage ou de um arquivo de backup
function _normalizar(s){
  const bet = (s && s.bet) || _betVazio();
  bet.apostadores = Array.isArray(bet.apostadores) ? bet.apostadores : [];
  bet.palpites = bet.palpites || {};
  bet.resultados = bet.resultados || {};
  return { placares: (s && s.placares) || _seedPlacares(), ko: (s && s.ko) || {}, bet };
}

function carregarEstado(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw){
      const s = JSON.parse(raw);
      if (s && s.placares) return _normalizar(s);
    }
  } catch (e){ /* localStorage indisponível (ex.: file:// em alguns navegadores) */ }
  return { placares: _seedPlacares(), ko: {}, bet: _betVazio() };
}

/* ---- Backup em arquivo (.json): garante os dados mesmo trocando de navegador/máquina ---- */
function baixarBackup(state){
  try {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'copa2026-7rdbet-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (e){ alert('Não foi possível gerar o backup.'); }
}

function lerBackup(file, onok){
  const r = new FileReader();
  r.onload = () => {
    try {
      const s = JSON.parse(r.result);
      if (!s || !s.placares) throw new Error('formato');
      const st = _normalizar(s);
      salvarEstado(st);
      onok(st);
    } catch (e){ alert('Arquivo de backup inválido.'); }
  };
  r.onerror = () => alert('Não foi possível ler o arquivo.');
  r.readAsText(file);
}

function salvarEstado(state){
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e){ /* ignora se não for possível persistir */ }
}

// "Restaurar/Limpar" mexem só na simulação (placares/mata-mata) — o bolão é preservado
function restaurarOficial(estadoAtual){
  const state = { placares: _seedPlacares(), ko: {}, bet: (estadoAtual && estadoAtual.bet) || _betVazio() };
  salvarEstado(state);
  return state;
}

function limparTudo(estadoAtual){
  const state = { placares: {}, ko: {}, bet: (estadoAtual && estadoAtual.bet) || _betVazio() };
  salvarEstado(state);
  return state;
}
