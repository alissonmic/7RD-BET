/* storage.js — Integrado com Firebase */
import { db } from './firebase-config.js';
import { ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const dbRef = ref(db, 'bolao/estado');

// Função de carregar agora é ASSÍNCRONA (precisa de um callback)
export function carregarEstado(callback) {
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    callback(data ? _normalizar(data) : _normalizar(null));
  });
}

// Salvar agora envia para o Firebase
export function salvarEstado(state) {
  set(dbRef, state);
}

// --- Funções Auxiliares (mantidas para o seu app funcionar) ---
function _seedPlacares(){
  const p = {};
  if (typeof SEED_RESULTS !== 'undefined') {
    Object.keys(SEED_RESULTS).forEach(id => p[id] = SEED_RESULTS[id].slice());
  }
  return p;
}

function _betVazio(){ return { apostadores: [], palpites: {}, resultados: {} }; }

function _normalizar(s){
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
