/* ============================================================================
 * betpage.js — Página isolada do bolão "7RD BET" (bet.html)
 *  Usa: TIMES/JOGOS_GRUPO (data.js), HORARIOS (horarios.js),
 *       jogosDeAposta/pontos/rankingBolao (bet.js), estado (storage.js).
 *  IMPORTANTE: ao digitar um placar, NÃO reconstruímos os inputs (só atualizamos
 *  os pontos e o ranking) — assim o número digitado não some e o foco fica.
 * ==========================================================================*/
let estado = carregarEstado();

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

/* ---------- render (estrutura) ---------- */
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
      <div class="bet-confronto">${_betFlagSigla(info.mandante)} <span class="vs">×</span> ${_betFlagSigla(info.visitante)}</div>
      <div class="bet-real">
        <span class="bet-real-lbl">Resultado real:</span>
        <input class="bet-realin" type="number" min="0" inputmode="numeric" data-jogo="${j.id}" data-lado="m" value="${real[0] != null ? real[0] : ''}">
        <span class="x">×</span>
        <input class="bet-realin" type="number" min="0" inputmode="numeric" data-jogo="${j.id}" data-lado="v" value="${real[1] != null ? real[1] : ''}">
        ${estado.placares[j.id] ? `<button class="bet-puxar" data-betpuxar="${j.id}" title="Copiar o placar que está na aba Grupos">↓ da aba Grupos</button>` : ''}
      </div>
      ${corpo}
    </div>`;
  }).join('') || '<p class="bet-vazio">Sem jogos de aposta no período.</p>';
}

function render(){ renderApostadores(); renderRanking(); renderJogos(); }

/* Atualiza SÓ os pontos e o ranking (sem reconstruir os inputs) — usado ao digitar */
function atualizarDerivados(){
  const bet = estado.bet;
  jogosDeAposta().forEach(j => {
    bet.apostadores.forEach((n, i) => {
      const cel = $(`[data-pts="${j.id}|${i}"]`);
      if (!cel) return;
      const palp = bet.palpites[j.id] && bet.palpites[j.id][n];
      const pp = pontos(palp, bet.resultados[j.id]);
      cel.textContent = (pp == null ? '–' : pp);
    });
  });
  renderRanking();
}

/* ---------- eventos ---------- */
document.addEventListener('input', (ev) => {
  const el = ev.target;
  if (el.classList.contains('bet-palp')){          // palpite (salva parcial; não rebuilda inputs)
    const id = el.dataset.jogo, nome = estado.bet.apostadores[+el.dataset.apidx];
    const ins = el.closest('tr').querySelectorAll('input.bet-palp');
    const gm = lerInt([...ins].find(i => i.dataset.lado === 'm').value);
    const gv = lerInt([...ins].find(i => i.dataset.lado === 'v').value);
    estado.bet.palpites[id] = estado.bet.palpites[id] || {};
    if (gm == null && gv == null) delete estado.bet.palpites[id][nome];
    else estado.bet.palpites[id][nome] = [gm, gv];
    salvarEstado(estado); atualizarDerivados();
  }
  if (el.classList.contains('bet-realin')){         // resultado real (salva parcial)
    const id = el.dataset.jogo;
    const ins = el.closest('.bet-real').querySelectorAll('input.bet-realin');
    const gm = lerInt([...ins].find(i => i.dataset.lado === 'm').value);
    const gv = lerInt([...ins].find(i => i.dataset.lado === 'v').value);
    if (gm == null && gv == null) delete estado.bet.resultados[id];
    else estado.bet.resultados[id] = [gm, gv];
    salvarEstado(estado); atualizarDerivados();
  }
});

document.addEventListener('click', (ev) => {
  const del = ev.target.closest('[data-betdel]');
  if (del){
    const i = +del.dataset.betdel, nome = estado.bet.apostadores[i];
    estado.bet.apostadores.splice(i, 1);
    Object.keys(estado.bet.palpites).forEach(mid => { if (estado.bet.palpites[mid]) delete estado.bet.palpites[mid][nome]; });
    salvarEstado(estado); render(); return;
  }
  const puxar = ev.target.closest('[data-betpuxar]');
  if (puxar){
    const id = puxar.dataset.betpuxar;
    if (estado.placares[id]) estado.bet.resultados[id] = estado.placares[id].slice();
    salvarEstado(estado); renderJogos(); renderRanking(); return;
  }
});

function addApostador(){
  const inp = $('#bet-novo'), nome = inp.value.trim();
  if (!nome) return;
  if (estado.bet.apostadores.some(n => n.toLowerCase() === nome.toLowerCase())){ inp.value = ''; return; }
  estado.bet.apostadores.push(nome);
  inp.value = '';
  salvarEstado(estado); render(); inp.focus();
}
$('#bet-add-btn').addEventListener('click', addApostador);
$('#bet-novo').addEventListener('keydown', (e) => { if (e.key === 'Enter') addApostador(); });

// Backup em arquivo (.json) — baixar e restaurar
$('#btn-backup').addEventListener('click', () => baixarBackup(estado));
$('#btn-restore').addEventListener('click', () => $('#file-backup').click());
$('#file-backup').addEventListener('change', (e) => {
  const f = e.target.files[0];
  if (f && confirm('Restaurar este backup vai SUBSTITUIR os dados atuais. Continuar?')){
    lerBackup(f, (st) => { estado = st; render(); });
  }
  e.target.value = '';
});

render();
