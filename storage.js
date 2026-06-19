/* storage.js — Integrado com Firebase */
import { db } from './firebase-config.js';
import { ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const dbRef = ref(db, 'bolao/estado');

// Carregar dados da nuvem
export function carregarEstado(callback) {
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    callback(data ? _normalizar(data) : _normalizar(null));
  });
}

// Salvar dados na nuvem
export function salvarEstado(state) {
  set(dbRef, state);
}

// --- Funções utilitárias ---
export function _seedPlacares(){
  const p = {};
  if (typeof SEED_RESULTS !== 'undefined') {
    Object.keys(SEED_RESULTS).forEach(id => p[id] = SEED_RESULTS[id].slice());
  }
  return p;
}

export function _betVazio(){ return { apostadores: [], palpites: {}, resultados: {} }; }

export function _normalizar(s){
  const bet = (s && s.bet) || _betVazio();
  bet.apostadores = Array.isArray(bet.apostadores) ? bet.apostadores : [];
  bet.palpites = bet.palpites || {};
  bet.resultados = bet.resultados || {};
  return { placares: (s && s.placares) || _seedPlacares(), ko: (s && s.ko) || {}, bet };
}

export function restaurarOficial(estadoAtual){
  const state = { placares: _seedPlacares(), ko: {}, bet: (estadoAtual && estadoAtual.bet) || _betVazio() };
  salvarEstado(state);
  return state;
}

export function limparTudo(estadoAtual){
  const state = { placares: {}, ko: {}, bet: (estadoAtual && estadoAtual.bet) || _betVazio() };
  salvarEstado(state);
  return state;
}

// Exposição das funções de backup para o escopo global (window)
// Isso resolve a falha de comunicação após a mudança para 'type="module"'
window.baixarBackup = baixarBackup;
window.lerBackup = lerBackup;

// As funções abaixo (baixarBackup/lerBackup) são as que você já tinha no arquivo
// originais, apenas mantidas aqui para garantir o funcionamento do sistema de arquivos
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
