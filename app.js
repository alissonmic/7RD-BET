/* ============================================================================
 * betpage.js — Página isolada do bolão "7RD BET" (bet.html)
 * ==========================================================================*/
import { carregarEstado, salvarEstado } from './storage.js';

// Puxa as dependências globais
const TIMES = window.TIMES;
const jogosDeAposta = window.jogosDeAposta;
const pontos = window.pontos;
const rankingBolao = window.rankingBolao;
const _JOGO_INFO = window._JOGO_INFO;
const _ehBrasil = window._ehBrasil;
const _diaSemana = window._diaSemana;
const baixarBackup = window.baixarBackup;
const lerBackup = window.lerBackup;

const $ = sel => document.querySelector(sel);
const DIAS_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const ddmm = iso => iso.slice(8) + '/' + iso.slice(5, 7);
const _esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

function flagImg(id){
  const t = TIMES[id];
  return `<img class="flag" src="https://flagcdn.com/w40/${t.flag}.png" alt="" loading="lazy" onerror="this.style.display='none'">`;
}

const _betFlagSigla = id => flagImg(id) + '<b class="bsigla">' + id + '</b>';
const lerInt = v => { if (v === '' || v == null) return null; const n = parseInt(v, 10); return (isNaN(n) || n < 0) ? null : n; };

function renderApostadores(){
  const bet = estado.bet;
  $('#bet-apostadores').innerHTML = bet.apostadores.length
    ? bet.apostadores.map((n, i) =>
        `<span class="chip">${_esc(n)}<button class="chip-x" data-betdel="${i}" title="Remover">×</button></span>`).join('')
    : '<span class="bet-vazio">nenhum apostador ainda</span>';
}

function renderRanking(){
  const bet = estado.bet;
  if (!bet.apostadores.length){
    $('#bet-ranking').innerHTML = '<p class="bet-vazio">Adicione apostadores para começar o bolão.</p>';
    return;
  }
  const rk = rankingBolao(bet);
  const linhas = rk.map(r => `<tr class="${r.pos === 1 && r.pts > 0 ? 'lider' : ''}">
      <td><span class="pos-pill">${r.pos}</span></td>
      <td class="time">${_esc(r.nome)}</td>
      <td class="pts">${r.pts}</td><td>${r.cravadas}</td><td>${r.palpitados}</td>
    </tr>`).join('');
  $('#bet-ranking').innerHTML = `<table class="tabela bet-rank">
    <thead><tr><th>#</th><th class="time">Apostador</th><th>Pts</th>
      <th title="Placares exatos (cravadas)">✓</th><th title="Jogos palpitados">J</th></tr></thead>
    <tbody>${linhas}</tbody></table>`;
}

function renderJogos(){
  const bet = estado.bet;
  const jogos = jogosDeAposta();
  $('#bet-jogos').innerHTML = jogos.map(j => {
    const info = _JOGO_INFO[j.id];
    const real = bet.resultados[j.id] || [null, null];
    const cab = `${DIAS_SEMANA[_diaSemana(j.d)]} ${ddmm(j.d)} · ${j.h}` + (_ehBrasil(j.id) ? ' · 🇧🇷 BRASIL' : '');
    const linhasAp = bet.apostadores.map((n, i) => {
      const palp = (bet.palpites[j.id] && bet.palpites[j.id][n]) || [null, null];
      const pp = pontos(palp, bet.resultados[j.id]);
      return `<tr>
        <td class="time">${_esc(n)}</td>
        <td class="bet-pin">
          <input class="bet-palp" type="number" min="0" inputmode="numeric" data-jogo="${j.id}" data-apidx="${i}" data-lado="m" value="${palp[0] != null ? palp[0] : ''}">
          <span class="x">×</span>
          <input class="bet-palp" type="number" min="0" inputmode="numeric" data-jogo="${j.id}" data-apidx="${i}" data-lado="v" value="${palp[1] != null ? palp[1] : ''}">
        </td>
        <td class="pts" data-pts="${j.id}|${i}">${pp == null ? '–' : pp}</td>
      </tr>`;
    }).join('');
    const corpo = bet.apostadores.length
      ? `<table class="tabela bet-palps"><thead><tr><th class="time">Apostador</th><th>Palpite</th><th>Pts</th></tr></thead><tbody>${linhasAp}</tbody></table>`
      : '<p class="bet-vazio">adicione apostadores para palpitar</p>';
    return `<div class="bet-jogo">
      <div class="bet-jogo-head">${cab}</div>
      <div class="bet-confronto">${_betFlagSigla(info.
