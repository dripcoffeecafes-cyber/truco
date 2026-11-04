/* ============================================================
   CARTEADO — app principal
   Placar de Truco, Pontinho, Três Sete e Canastra
   ============================================================ */
(() => {
  'use strict';

  // ---------- util ----------
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9);
  const pick = a => a[(Math.random() * a.length) | 0];
  const fmtDate = ts => new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  const AV_COLORS = ['#e5383b', '#3a86ff', '#ff8c42', '#9d4edd', '#2ec4b6', '#ff5d8f', '#f2b134', '#06d6a0'];
  const avColor = i => AV_COLORS[i % AV_COLORS.length];
  const initials = n => (n || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();

  function toast(msg, ms = 1800) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), ms);
  }

  // ---------- estado ----------
  const KEY = 'carteado:v1';
  const DEFAULT = { tab: 'home', view: 'home', match: null, history: [], names: [], rulesGame: 'truco' };
  let S = load();
  function load() { try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch (e) { return { ...DEFAULT }; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

  const GAMES = {
    truco: { name: 'Truco', sub: 'Gaudério ou Paulista', cls: 'truco', color: '#e5383b', teams: true },
    pontinho: { name: 'Pontinho', sub: '100 pontos · quem zera estoura', cls: 'pontinho', color: '#3a86ff', teams: false },
    tressete: { name: 'Três Sete', sub: 'Vazas em dupla · 21 pontos', cls: 'tressete', color: '#ff8c42', teams: true },
    canastra: { name: 'Canastra', sub: 'Duplas · 3.000 pontos', cls: 'canastra', color: '#9d4edd', teams: true }
  };

  const PHRASES = {
    win: ['Tchê, que lavada!', 'Deu pra ti, bah!', 'Lavou a égua!', 'Campeões da bodega!', 'Mais fácil que tirar doce de guri!', 'Capaz que iam perder!', 'Isso é que é carteado!', 'Mandaram ver, tchê!', 'Barbaridade, que jogo!', 'Nem o diabo joga assim!'],
    lose: ['{l} paga a próxima rodada.', '{l} vai embaralhar o resto da noite.', '{l} lava a louça hoje.', '{l} ficou devendo o chimarrão.', '{l} tem que treinar mais, tchê.', '{l} jura que as cartas estavam marcadas.', 'Alguém dá um abraço no {l}.']
  };

  // ---------- SVG arte (desenhos genéricos próprios) ----------
  const ART = {
    logo: `<svg viewBox="0 0 120 120"><defs><linearGradient id="lg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#fff7e6"/><stop offset="1" stop-color="#f4e7c8"/></linearGradient></defs>
      <g transform="rotate(-14 60 64)"><rect x="24" y="22" width="56" height="78" rx="8" fill="url(#lg)" stroke="#1d1a14" stroke-width="2"/><path d="M52 44c-9-11-24-2-17 9 4 7 17 17 17 17s13-10 17-17c7-11-8-20-17-9z" fill="#e5383b"/></g>
      <g transform="rotate(12 70 60)"><rect x="46" y="18" width="56" height="78" rx="8" fill="url(#lg)" stroke="#1d1a14" stroke-width="2"/><path d="M74 36c-8 12-20 18-18 28 1 7 9 9 14 4-1 5-3 8-6 10h20c-3-2-5-5-6-10 5 5 13 3 14-4 2-10-10-16-18-28z" fill="#1d1a14"/></g>
      <circle cx="26" cy="96" r="9" fill="#f2b134" stroke="#b57d16" stroke-width="2"/><circle cx="40" cy="104" r="9" fill="#f2b134" stroke="#b57d16" stroke-width="2"/><circle cx="16" cy="108" r="9" fill="#ffd369" stroke="#b57d16" stroke-width="2"/></svg>`,
    truco: `<svg class="art" viewBox="0 0 100 100"><rect x="26" y="14" width="48" height="68" rx="6" fill="#fff7e6" stroke="#1d1a14" stroke-width="2"/><path d="M50 30c-7 11-18 16-16 25 1 6 8 8 12 3-1 5-3 7-5 9h18c-2-2-4-4-5-9 4 5 11 3 12-3 2-9-9-14-16-25z" fill="#1d1a14"/><text x="31" y="26" font-size="9" font-weight="900" fill="#1d1a14">1</text><path d="M20 86c6-12 4-20 12-24-2 8 4 10 6 16 2-6 8-10 6-18 10 6 10 18 10 26z" fill="#ff8c42" opacity=".95"/><path d="M28 88c3-7 2-12 6-14-1 5 2 6 3 9 1-3 4-6 3-10 5 4 5 10 5 15z" fill="#ffd369"/></svg>`,
    pontinho: `<svg class="art" viewBox="0 0 100 100"><g transform="rotate(-18 50 60)"><rect x="18" y="26" width="40" height="56" rx="5" fill="#fff7e6" stroke="#1d1a14" stroke-width="2"/><circle cx="30" cy="40" r="4" fill="#e5383b"/><circle cx="46" cy="40" r="4" fill="#e5383b"/><circle cx="30" cy="54" r="4" fill="#e5383b"/><circle cx="46" cy="54" r="4" fill="#e5383b"/><circle cx="38" cy="68" r="4" fill="#e5383b"/></g><g transform="rotate(10 60 60)"><rect x="44" y="20" width="40" height="56" rx="5" fill="#fff7e6" stroke="#1d1a14" stroke-width="2"/><circle cx="56" cy="34" r="4" fill="#1d1a14"/><circle cx="72" cy="34" r="4" fill="#1d1a14"/><circle cx="64" cy="48" r="4" fill="#1d1a14"/><circle cx="56" cy="62" r="4" fill="#1d1a14"/><circle cx="72" cy="62" r="4" fill="#1d1a14"/></g></svg>`,
    tressete: `<svg class="art" viewBox="0 0 100 100"><g transform="rotate(-12 40 55)"><rect x="16" y="22" width="42" height="60" rx="5" fill="#fff7e6" stroke="#1d1a14" stroke-width="2"/><text x="37" y="62" text-anchor="middle" font-size="34" font-weight="900" fill="#e5383b" font-family="Arial Black,Arial">3</text></g><g transform="rotate(14 62 50)"><rect x="46" y="16" width="42" height="60" rx="5" fill="#fff7e6" stroke="#1d1a14" stroke-width="2"/><text x="67" y="56" text-anchor="middle" font-size="34" font-weight="900" fill="#1d1a14" font-family="Arial Black,Arial">7</text></g></svg>`,
    canastra: `<svg class="art" viewBox="0 0 100 100"><g transform="rotate(-25 40 40)"><rect x="24" y="12" width="30" height="42" rx="4" fill="#fff7e6" stroke="#1d1a14" stroke-width="2"/></g><g transform="rotate(-8 50 40)"><rect x="34" y="8" width="30" height="42" rx="4" fill="#fff7e6" stroke="#1d1a14" stroke-width="2"/><path d="M49 20c-4-5-11-1-8 4 2 3 8 8 8 8s6-5 8-8c3-5-4-9-8-4z" fill="#e5383b"/></g><g transform="rotate(12 60 40)"><rect x="46" y="10" width="30" height="42" rx="4" fill="#fff7e6" stroke="#1d1a14" stroke-width="2"/></g><path d="M14 50h72l-8 38H22z" fill="#c2410c"/><path d="M14 50h72l-3 8H17z" fill="#f2b134"/><path d="M26 58l5 30M38 58l3 30M50 58v30M62 58l-3 30M74 58l-5 30" stroke="#8a2d08" stroke-width="2.5"/><path d="M22 70h58M24 80h54" stroke="#8a2d08" stroke-width="2.5"/></svg>`,
    trophy: `<svg class="trophy" viewBox="0 0 120 120"><defs><linearGradient id="tg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffd369"/><stop offset="1" stop-color="#d4921a"/></linearGradient></defs>
      <path d="M38 18h44v10h12v10c0 11-8 20-18 22a24 24 0 0 1-12 12v12h12v8H44v-8h12V72a24 24 0 0 1-12-12C34 58 26 49 26 38V28h12V18z" fill="url(#tg)" stroke="#8a5a0b" stroke-width="3" stroke-linejoin="round"/>
      <path d="M34 34v4c0 6 4 10 9 12l-1-16h-8zm52 0v4c0 6-4 10-9 12l1-16h8z" fill="#f2b134"/>
      <path d="M60 32l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z" fill="#fff7e6"/>
      <rect x="40" y="92" width="40" height="8" rx="2" fill="#8a5a0b"/></svg>`,
    palito: (filled, diag) => `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round">
      ${filled >= 1 ? '<path d="M4 4v16"/>' : ''}${filled >= 2 ? '<path d="M4 4h16"/>' : ''}${filled >= 3 ? '<path d="M20 4v16"/>' : ''}${filled >= 4 ? '<path d="M4 20h16"/>' : ''}${diag ? '<path d="M5 19 19 5" stroke="#ffd369"/>' : ''}</svg>`
  };

  function palitos(n, max) {
    let html = '';
    const groups = Math.ceil(max / 5);
    for (let g = 0; g < groups; g++) {
      const v = Math.max(0, Math.min(5, n - g * 5));
      if (v === 0 && n < max) { html += ART.palito(0, false).replace('<svg', '<svg style="opacity:.25"'); continue; }
      html += ART.palito(Math.min(v, 4), v === 5);
    }
    return html;
  }

  // ---------- render ----------
  const screen = $('#screen'), app = $('#app');
  function render() {
    save();
    app.classList.toggle('no-tabs', S.view === 'game' || S.view === 'setup');
    $$('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === S.tab));
    screen.scrollTop = 0;
    const map = { home: renderHome, setup: renderSetup, game: renderGame, hall: renderHall, rules: renderRules };
    screen.innerHTML = map[S.view]();
    bind();
  }

  $$('.tab').forEach(b => b.addEventListener('click', () => { S.tab = b.dataset.tab; S.view = b.dataset.tab; Sound.click(); render(); }));

  // ========== HOME ==========
  function renderHome() {
    const m = S.match;
    return `
      <div class="hero">${ART.logo.replace('<svg', '<svg class="logo"')}<h1>Carteado</h1><p>Placar pra marcar o jogo e zoar a gurizada</p></div>
      <div class="gamegrid">
        ${Object.entries(GAMES).map(([k, g]) => `<button class="gamecard ${g.cls}" data-new="${k}">${ART[k]}<h3>${g.name}</h3><span>${g.sub}</span></button>`).join('')}
      </div>
      ${m && !m.finished ? `<button class="resume" data-resume>▶️ <span>Continuar <b>${GAMES[m.game].name}</b> em andamento<br><small class="muted">${resumeLabel(m)}</small></span></button>` : ''}
      <div id="install" class="card dark mt small hidden">
        <b>📲 Instalar no celular:</b> <span id="install-txt"></span>
        <div class="row mt"><button class="btn sm" id="install-btn">Instalar</button><button class="btn sm ghost" id="install-dismiss">Depois</button></div>
      </div>
      <p class="center small muted mt">Toque no ícone de som pra ligar/desligar os efeitos durante o jogo.</p>`;
  }
  function resumeLabel(m) {
    if (m.game === 'pontinho') return m.players.filter(p => p.score > 0).map(p => `${p.name} ${p.score}`).join(' · ');
    return `${m.teams[0].name} ${m.scores[0]} × ${m.scores[1]} ${m.teams[1].name}`;
  }

  // ========== SETUP ==========
  let setup = null;
  function newSetup(game) {
    const recent = S.names.slice(0, 8);
    setup = {
      game,
      variant: game === 'truco' ? 'gaucho' : null,
      target: game === 'truco' ? 24 : game === 'tressete' ? 21 : game === 'canastra' ? 3000 : 100,
      teams: [{ name: 'Nós', players: ['', ''] }, { name: 'Eles', players: ['', ''] }],
      players: [recent[0] || '', recent[1] || '', recent[2] || '', recent[3] || ''].map(n => n)
    };
  }
  function renderSetup() {
    const g = GAMES[setup.game];
    let body = '';
    if (setup.game === 'truco') {
      body += `<div class="card dark mb"><div class="field"><label>Modalidade</label>
        <div class="seg" data-seg="variant"><button data-v="gaucho" class="${setup.variant === 'gaucho' ? 'on' : ''}">Gaudério · 24</button><button data-v="paulista" class="${setup.variant === 'paulista' ? 'on' : ''}">Paulista · 12</button></div></div></div>`;
    }
    if (setup.game === 'tressete') {
      body += `<div class="card dark mb"><div class="field"><label>Partida até</label>
        <div class="seg" data-seg="target"><button data-v="21" class="${setup.target == 21 ? 'on' : ''}">21</button><button data-v="31" class="${setup.target == 31 ? 'on' : ''}">31</button><button data-v="41" class="${setup.target == 41 ? 'on' : ''}">41</button></div></div></div>`;
    }
    if (setup.game === 'canastra') {
      body += `<div class="card dark mb"><div class="field"><label>Partida até</label>
        <div class="seg" data-seg="target"><button data-v="1500" class="${setup.target == 1500 ? 'on' : ''}">1.500</button><button data-v="3000" class="${setup.target == 3000 ? 'on' : ''}">3.000</button><button data-v="5000" class="${setup.target == 5000 ? 'on' : ''}">5.000</button></div></div></div>`;
    }
    if (g.teams) {
      body += setup.teams.map((t, i) => `<div class="teambox t${i}"><h3>Dupla ${i + 1}</h3>
        <input data-team="${i}" value="${esc(t.name)}" placeholder="Nome da dupla" maxlength="14">
        <div class="players"><input data-player="${i}-0" value="${esc(t.players[0])}" placeholder="Jogador 1" maxlength="14" list="names"><input data-player="${i}-1" value="${esc(t.players[1])}" placeholder="Jogador 2" maxlength="14" list="names"></div></div>`).join('');
    } else {
      body += `<div class="card dark mb"><div class="field"><label>Jogadores (3 a 8) · todos começam com ${setup.target}</label></div>
        <div class="playerlist">${setup.players.map((p, i) => `<div class="p"><div class="av" style="background:${avColor(i)}">${initials(p) || i + 1}</div><input data-pl="${i}" value="${esc(p)}" placeholder="Nome" maxlength="14" list="names"><button class="iconbtn" data-rm="${i}"><svg><use href="#i-x"/></svg></button></div>`).join('')}</div>
        <button class="btn sm ghost mt" data-add>＋ adicionar jogador</button></div>`;
    }
    return `<div class="topbar"><button class="iconbtn" data-home><svg><use href="#i-back"/></svg></button><h2>${g.name}</h2></div>
      ${body}
      <datalist id="names">${S.names.map(n => `<option value="${esc(n)}">`).join('')}</datalist>
      <button class="btn big block mt" data-start>Começar o jogo 🃏</button>`;
  }

  function startMatch() {
    const g = GAMES[setup.game];
    const m = { id: uid(), game: setup.game, variant: setup.variant, target: setup.target, startedAt: Date.now(), finished: false, log: [], undo: [] };
    if (g.teams) {
      m.teams = setup.teams.map((t, i) => ({ name: t.name.trim() || (i ? 'Eles' : 'Nós'), players: t.players.map(p => p.trim()).filter(Boolean) }));
      m.scores = [0, 0];
      rememberNames(m.teams.flatMap(t => t.players));
    } else {
      const ps = setup.players.map(p => p.trim()).filter(Boolean);
      if (ps.length < 2) { toast('Coloca pelo menos 2 jogadores, tchê'); return; }
      m.players = ps.map((n, i) => ({ name: n, score: setup.target, out: false, color: avColor(i) }));
      rememberNames(ps);
    }
    S.match = m; S.view = 'game'; Sound.drum(); render();
  }
  function rememberNames(list) {
    for (const n of list) { if (!n) continue; S.names = [n, ...S.names.filter(x => x.toLowerCase() !== n.toLowerCase())].slice(0, 30); }
  }

  // ========== GAME ==========
  function renderGame() {
    const m = S.match;
    const head = `<div class="topbar"><button class="iconbtn" data-home><svg><use href="#i-back"/></svg></button><h2>${GAMES[m.game].name}${m.variant ? ' · ' + (m.variant === 'gaucho' ? 'Gaudério' : 'Paulista') : ''}</h2>
      <button class="iconbtn" data-sound title="Som">${Sound.enabled ? '🔊' : '🔇'}</button>
      <button class="iconbtn" data-undo title="Desfazer" ${m.undo.length ? '' : 'disabled'}><svg><use href="#i-undo"/></svg></button>
      <button class="iconbtn" data-settings><svg><use href="#i-gear"/></svg></button></div>`;
    if (m.game === 'pontinho') return head + renderPontinho(m);
    return head + renderTeamGame(m);
  }

  function teamBoard(m, opts = {}) {
    const lead = m.scores[0] === m.scores[1] ? -1 : (m.scores[0] > m.scores[1] ? 0 : 1);
    return `<div class="board">${m.teams.map((t, i) => {
      const s = m.scores[i];
      let sub = '', pal = '', danger = '';
      if (m.game === 'truco') {
        if (m.variant === 'gaucho') {
          const boas = s >= 12;
          sub = s >= 23 ? '<span class="sub hot">FALTA 1!</span>' : `<span class="sub">${boas ? '✨ BOAS' : 'MALAS'}</span>`;
          pal = `<div class="palitos ${boas ? 'boas' : ''}">${palitos(boas ? s - 12 : s, 12)}</div>`;
          if (s >= 23) danger = 'danger';
        } else {
          sub = s === 11 ? '<span class="sub hot">MÃO DE 11!</span>' : `<span class="sub">faltam ${12 - s}</span>`;
          pal = `<div class="palitos">${palitos(s, 12)}</div>`;
          if (s === 11) danger = 'danger';
        }
      } else {
        const faltam = m.target - s;
        sub = `<span class="sub ${faltam <= m.target * .1 ? 'hot' : ''}">faltam ${Math.max(0, faltam).toLocaleString('pt-BR')}</span>`;
        pal = `<div class="meter" style="margin:10px 8px 0"><i style="width:${Math.min(100, s / m.target * 100)}%"></i></div>`;
      }
      return `<div class="teamscore t${i} ${lead === i ? 'leading' : ''} ${danger}" data-ts="${i}">
        <div class="name">${esc(t.name)}</div><div class="players">${esc(t.players.join(' & '))}</div>
        <div class="num">${s.toLocaleString('pt-BR')}</div>${sub}${pal}</div>`;
    }).join('')}</div>`;
  }

  function renderTeamGame(m) {
    let actions = '';
    if (m.game === 'truco') {
      const rows = m.variant === 'gaucho'
        ? [['Mão', 1], ['Truco', 2, 'truco'], ['Retruco', 3, 'truco'], ['Vale 4', 4, 'truco'], ['Envido', 2], ['Real envido', 3], ['Falta envido', 'falta'], ['Flor', 3, 'flor'], ['Contraflor', 6, 'flor'], ['Não quis / outro', 'custom'], ['−1 (errei)', -1]]
        : [['Mão', 1], ['Truco', 3, 'truco'], ['Seis', 6, 'truco'], ['Nove', 9, 'truco'], ['Doze', 12, 'truco'], ['Correu do truco', 1], ['Correu do seis', 3], ['Correu do nove', 6], ['Outro valor', 'custom'], ['−1 (errei)', -1]];
      actions = `<div class="actions">${rows.map(([label, v, kind]) => [0, 1].map(i =>
        `<button class="chip t${i} ${kind === 'truco' ? 'hot' : ''} ${v === -1 ? 'minus' : ''}" data-pts="${v}" data-team="${i}" data-kind="${kind || ''}" data-label="${esc(label)}">${label}${typeof v === 'number' && v > 0 ? ` <small>+${v}</small>` : ''}</button>`).join('')).join('')}</div>`;
    } else if (m.game === 'tressete') {
      actions = `<button class="btn block big" data-hand>Registrar mão 🧮</button>
        <div class="actions mt">${[0, 1].map(i => `<button class="chip t${i}" data-pts="1" data-team="${i}" data-label="+1">+1</button>`).join('')}
        ${[0, 1].map(i => `<button class="chip t${i}" data-pts="3" data-team="${i}" data-label="Acusação">Acusação +3</button>`).join('')}
        ${[0, 1].map(i => `<button class="chip t${i} minus" data-pts="-1" data-team="${i}" data-label="−1">−1</button>`).join('')}</div>`;
    } else if (m.game === 'canastra') {
      actions = `<button class="btn block big" data-hand>Registrar mão 🧮</button>
        <div class="actions mt">${[0, 1].map(i => `<button class="chip t${i}" data-pts="100" data-team="${i}" data-label="+100">+100</button>`).join('')}
        ${[0, 1].map(i => `<button class="chip t${i}" data-pts="custom" data-team="${i}" data-label="Outro">Outro valor</button>`).join('')}
        ${[0, 1].map(i => `<button class="chip t${i} minus" data-pts="-100" data-team="${i}" data-label="−100">−100</button>`).join('')}</div>`;
    }
    return teamBoard(m) + actions + renderLog(m);
  }

  function renderLog(m) {
    if (!m.log.length) return `<p class="center small muted mt">Nenhum tento ainda. Bora jogar!</p>`;
    return `<div class="log">${m.log.slice(-12).reverse().map(l => `<div class="item t${l.team ?? ''}"><span class="who">${esc(l.who)}</span><span>${esc(l.label)}</span><span class="pts">${l.pts > 0 ? '+' : ''}${l.pts.toLocaleString('pt-BR')}</span></div>`).join('')}</div>`;
  }

  function snapshot(m) {
    m.undo.push(JSON.stringify({ scores: m.scores, players: m.players, log: m.log }));
    if (m.undo.length > 40) m.undo.shift();
  }
  function undo() {
    const m = S.match; if (!m || !m.undo.length) return;
    const s = JSON.parse(m.undo.pop());
    m.scores = s.scores; m.players = s.players; m.log = s.log; m.finished = false; m.winner = null;
    Sound.minus(); toast('Desfeito'); render();
  }

  function faltaEnvido(m, team) {
    const other = 1 - team, a = m.scores[team], b = m.scores[other];
    const lead = Math.max(a, b);
    if (m.variant === 'gaucho') return (a < 12 && b < 12) ? 12 - lead : 24 - lead;
    return 12 - lead;
  }

  function addPoints(team, pts, label, kind) {
    const m = S.match; if (!m || m.finished) return;
    snapshot(m);
    m.scores[team] = Math.max(0, m.scores[team] + pts);
    m.log.push({ team, who: m.teams[team].name, label, pts, t: Date.now() });
    if (kind === 'truco') { FX.flash(label.toUpperCase() + '!'); Sound.truco(); FX.vibrate([60, 40, 120]); }
    else if (kind === 'flor') { FX.flash('FLOR! 🌸', '#ff5d8f'); Sound.point(); FX.confetti(60); }
    else if (pts > 0) { Sound.point(); FX.vibrate(30); }
    else Sound.minus();
    render();
    const box = $(`.teamscore[data-ts="${team}"]`); if (box) { box.classList.add('pulse'); }
    checkTeamWin();
  }

  function checkTeamWin() {
    const m = S.match;
    const target = m.game === 'truco' ? (m.variant === 'gaucho' ? 24 : 12) : m.target;
    const reached = m.scores.map((s, i) => s >= target ? i : -1).filter(i => i >= 0);
    if (!reached.length) return;
    let w;
    if (reached.length === 2) { if (m.scores[0] === m.scores[1]) { toast('Empate acima da meta — joga mais uma mão!'); return; } w = m.scores[0] > m.scores[1] ? 0 : 1; }
    else w = reached[0];
    finishMatch({ winner: m.teams[w].name, winnerPlayers: m.teams[w].players, loser: m.teams[1 - w].name, loserPlayers: m.teams[1 - w].players, score: `${m.scores[w]} × ${m.scores[1 - w]}` });
  }

  function finishMatch(r) {
    const m = S.match; m.finished = true; m.winner = r.winner;
    S.history.unshift({ id: m.id, game: m.game, date: Date.now(), winner: r.winner, winnerPlayers: r.winnerPlayers || [], loser: r.loser, loserPlayers: r.loserPlayers || [], score: r.score });
    S.history = S.history.slice(0, 200);
    save();
    showWin(r);
  }

  function showWin(r) {
    const ov = $('#overlay');
    const loserName = r.loser || 'o resto';
    ov.innerHTML = `<div class="winbox">${ART.trophy}<div class="kicker">Vencedor${(r.winnerPlayers || []).length > 1 ? 'es' : ''}</div><h1>${esc(r.winner)}</h1>
      ${r.winnerPlayers && r.winnerPlayers.length ? `<p class="phrase small muted" style="margin:-2px 0 6px">${esc(r.winnerPlayers.join(' & '))}</p>` : ''}
      <p class="phrase">${esc(pick(PHRASES.win))}</p><div class="score">${esc(r.score)}</div>
      <div class="row" style="justify-content:center"><button class="btn" data-rematch>Revanche 🔁</button><button class="btn ghost" data-finish>Fechar</button></div>
      <p class="loser">${esc(pick(PHRASES.lose).replace('{l}', loserName))}</p></div>`;
    ov.classList.remove('hidden');
    Sound.fanfare(); FX.vibrate([100, 50, 100, 50, 300]);
    FX.confetti(220); setTimeout(() => FX.rain(140), 400); setTimeout(() => FX.fireworksShow(7), 900);
    setTimeout(() => FX.confetti(120, { x: innerWidth * .2, y: innerHeight * .6 }), 1600);
    setTimeout(() => FX.confetti(120, { x: innerWidth * .8, y: innerHeight * .6 }), 1900);
    $('[data-rematch]', ov).onclick = () => { ov.classList.add('hidden'); rematch(); };
    $('[data-finish]', ov).onclick = () => { ov.classList.add('hidden'); S.match = null; S.view = 'home'; S.tab = 'home'; render(); };
  }

  function rematch() {
    const m = S.match;
    const n = { ...m, id: uid(), startedAt: Date.now(), finished: false, winner: null, log: [], undo: [] };
    if (m.teams) { n.scores = [0, 0]; n.teams = m.teams.map(t => ({ ...t })); }
    if (m.players) n.players = m.players.map(p => ({ ...p, score: m.target, out: false }));
    S.match = n; Sound.drum(); render();
  }

  // ---------- PONTINHO ----------
  function renderPontinho(m) {
    const alive = m.players.filter(p => !p.out);
    const max = Math.max(...alive.map(p => p.score), 0);
    return `<div class="plist">${m.players.map((p, i) => `<div class="prow ${p.out ? 'out' : ''} ${!p.out && p.score === max && alive.length > 1 ? 'lead' : ''} ${!p.out && p.score <= 20 ? 'hot' : ''}" data-pp="${i}">
        <div class="av" style="background:${p.color}">${p.out ? '💀' : initials(p.name)}</div>
        <div class="n">${esc(p.name)}<small>${p.out ? 'estourou' : p.score <= 20 ? '🔥 na beira do estouro' : p.score === max && alive.length > 1 ? '👑 líder' : '&nbsp;'}</small>
          <div class="meter"><i style="width:${Math.max(0, p.score) / m.target * 100}%"></i></div></div>
        <div class="pts">${p.out ? 0 : p.score}</div>
        ${p.out && !m.finished ? `<button class="btn sm" data-back="${i}">Voltar</button>` : ''}</div>`).join('')}</div>
      <button class="btn block big mt" data-hand>Registrar mão 🃏</button>
      <p class="center small muted mt">Toque num jogador pra ajustar os pontos na mão. Quem estoura pode "voltar" pagando: entra com os pontos do pior colocado.</p>
      ${renderLog(m)}`;
  }

  function pontinhoSheet() {
    const m = S.match; const alive = m.players.map((p, i) => ({ ...p, i })).filter(p => !p.out);
    let bateu = -1;
    openSheet(`<h3>Quem bateu e quanto cada um perdeu?</h3>
      ${alive.map(p => `<div class="handrow" data-hr="${p.i}"><div class="av" style="background:${p.color}">${initials(p.name)}</div><div class="n">${esc(p.name)}<br><small class="muted">tem ${p.score}</small></div>
        <button class="bateu" data-bateu="${p.i}">Bateu</button><input type="number" inputmode="numeric" min="0" max="500" placeholder="0" data-lost="${p.i}"></div>`).join('')}
      <div class="row mt"><button class="btn ghost" data-close>Cancelar</button><button class="btn" data-apply style="flex:1">Lançar mão</button></div>`, sheet => {
      $$('[data-bateu]', sheet).forEach(b => b.onclick = () => {
        const i = +b.dataset.bateu; bateu = bateu === i ? -1 : i;
        $$('[data-bateu]', sheet).forEach(x => x.classList.toggle('on', +x.dataset.bateu === bateu));
        $$('[data-lost]', sheet).forEach(inp => { const d = +inp.dataset.lost === bateu; inp.disabled = d; if (d) inp.value = ''; });
        Sound.click();
      });
      $('[data-apply]', sheet).onclick = () => {
        snapshot(m);
        const outs = [];
        for (const p of alive) {
          if (p.i === bateu) { m.log.push({ who: p.name, label: 'bateu', pts: 0, t: Date.now() }); continue; }
          const v = parseInt($(`[data-lost="${p.i}"]`, sheet).value) || 0;
          if (!v) continue;
          const pl = m.players[p.i]; pl.score -= v;
          m.log.push({ who: pl.name, label: 'perdeu', pts: -v, t: Date.now() });
          if (pl.score <= 0) { pl.out = true; outs.push(pl.name); }
        }
        closeSheet(); Sound.point(); render();
        if (outs.length) { Sound.sad(); FX.flash('💀 ESTOUROU!', '#ff6b6b'); FX.vibrate([200, 80, 200]); toast(outs.join(', ') + ' estourou!', 2600); }
        checkPontinhoWin();
      };
    });
  }

  function pontinhoAdjust(i) {
    const m = S.match, p = m.players[i]; if (p.out) return;
    let delta = 0;
    openSheet(`<h3>${esc(p.name)} · ${p.score} pontos</h3><p class="small muted">Ajuste manual (erro de conta, acerto de mesa).</p>
      <div class="row" style="justify-content:center;gap:14px"><div class="stepper"><button data-d="-10">−10</button><button data-d="-1">−1</button><b data-show style="min-width:60px;font-size:22px">0</b><button data-d="1">+1</button><button data-d="10">+10</button></div></div>
      <div class="row mt"><button class="btn ghost" data-close>Cancelar</button><button class="btn" data-apply style="flex:1">Aplicar</button></div>`, sheet => {
      $$('[data-d]', sheet).forEach(b => b.onclick = () => { delta += +b.dataset.d; $('[data-show]', sheet).textContent = (delta > 0 ? '+' : '') + delta; Sound.click(); });
      $('[data-apply]', sheet).onclick = () => {
        if (delta) { snapshot(m); p.score += delta; m.log.push({ who: p.name, label: 'ajuste', pts: delta, t: Date.now() }); if (p.score <= 0) { p.out = true; toast(p.name + ' estourou!'); Sound.sad(); } }
        closeSheet(); render(); checkPontinhoWin();
      };
    });
  }

  function pontinhoBack(i) {
    const m = S.match, p = m.players[i];
    const alive = m.players.filter(x => !x.out);
    const worst = alive.length ? Math.min(...alive.map(x => x.score)) : m.target;
    snapshot(m); p.out = false; p.score = Math.max(1, worst);
    m.log.push({ who: p.name, label: 'voltou pagando', pts: p.score, t: Date.now() });
    Sound.drum(); toast(`${p.name} voltou com ${p.score}`); render();
  }

  function checkPontinhoWin() {
    const m = S.match; const alive = m.players.filter(p => !p.out);
    if (alive.length === 1 && m.players.length > 1) {
      const w = alive[0];
      const losers = m.players.filter(p => p.out).map(p => p.name);
      finishMatch({ winner: w.name, winnerPlayers: [w.name], loser: losers[losers.length - 1], loserPlayers: losers, score: `sobrou com ${w.score} pontos` });
    }
  }

  // ---------- TRÊS SETE: calculadora de mão ----------
  function tresseteSheet() {
    const m = S.match;
    const calc = sheet => {
      const vals = [0, 1].map(i => {
        const a = +$(`[data-f="ases-${i}"]`, sheet).value || 0, f = +$(`[data-f="fig-${i}"]`, sheet).value || 0, b = +$(`[data-f="bonus-${i}"]`, sheet).value || 0;
        const ult = $(`[data-ult="${i}"]`, sheet).checked ? 1 : 0;
        const pts = a + Math.floor(f / 3) + ult + b;
        $(`[data-sum="${i}"]`, sheet).textContent = pts; return pts;
      });
      return vals;
    };
    openSheet(`<h3>Contar a mão</h3><p class="small muted">Ases valem 1, figuras (3, 2, K, Q, J) valem ⅓ — sobra de figura não conta. Última vaza +1.</p>
      <div class="calcgrid">${[0, 1].map(i => `<div class="col t${i}"><h4>${esc(m.teams[i].name)}</h4>
        <div class="calcline">Ases <input type="number" inputmode="numeric" min="0" max="4" value="0" data-f="ases-${i}"></div>
        <div class="calcline">Figuras <input type="number" inputmode="numeric" min="0" max="16" value="0" data-f="fig-${i}"></div>
        <div class="calcline"><label class="check"><input type="radio" name="ult" data-ult="${i}"> Última vaza</label></div>
        <div class="calcline">Bônus <input type="number" inputmode="numeric" min="0" max="20" value="0" data-f="bonus-${i}"></div>
        <div class="calcline sum">Total <b data-sum="${i}">0</b></div></div>`).join('')}</div>
      <div class="row mt"><button class="btn ghost" data-close>Cancelar</button><button class="btn" data-apply style="flex:1">Lançar mão</button></div>`, sheet => {
      $$('input', sheet).forEach(inp => inp.addEventListener('input', () => calc(sheet)));
      $$('[data-ult]', sheet).forEach(inp => inp.addEventListener('change', () => calc(sheet)));
      $('[data-apply]', sheet).onclick = () => {
        const v = calc(sheet); snapshot(m);
        v.forEach((p, i) => { if (p) { m.scores[i] += p; m.log.push({ team: i, who: m.teams[i].name, label: 'mão', pts: p, t: Date.now() }); } });
        closeSheet(); Sound.point(); render(); checkTeamWin();
      };
    });
  }

  // ---------- CANASTRA: calculadora de mão ----------
  function canastraSheet() {
    const m = S.match;
    const calc = sheet => [0, 1].map(i => {
      const g = k => +$(`[data-f="${k}-${i}"]`, sheet).value || 0;
      const bat = $(`[data-bat="${i}"]`, sheet).checked ? 100 : 0;
      const morto = $(`[data-morto="${i}"]`, sheet).checked ? -100 : 0;
      const pts = g('limpa') * 200 + g('suja') * 100 + bat + g('mesa') - g('mao') + morto;
      $(`[data-sum="${i}"]`, sheet).textContent = pts.toLocaleString('pt-BR'); return pts;
    });
    openSheet(`<h3>Contar a mão</h3><p class="small muted">Limpa 200 · Suja 100 · Batida 100 · cartas na mesa somam, na mão descontam · sem morto −100.</p>
      <div class="calcgrid">${[0, 1].map(i => `<div class="col t${i}"><h4>${esc(m.teams[i].name)}</h4>
        <div class="calcline">Limpas <input type="number" inputmode="numeric" min="0" value="0" data-f="limpa-${i}"></div>
        <div class="calcline">Sujas <input type="number" inputmode="numeric" min="0" value="0" data-f="suja-${i}"></div>
        <div class="calcline"><label class="check"><input type="radio" name="bat" data-bat="${i}"> Bateu (+100)</label></div>
        <div class="calcline">Mesa <input type="number" inputmode="numeric" min="0" step="5" value="0" data-f="mesa-${i}"></div>
        <div class="calcline">Na mão <input type="number" inputmode="numeric" min="0" step="5" value="0" data-f="mao-${i}"></div>
        <div class="calcline"><label class="check"><input type="checkbox" data-morto="${i}"> Não pegou morto</label></div>
        <div class="calcline sum">Total <b data-sum="${i}">0</b></div></div>`).join('')}</div>
      <div class="row mt"><button class="btn ghost" data-close>Cancelar</button><button class="btn" data-apply style="flex:1">Lançar mão</button></div>`, sheet => {
      $$('input', sheet).forEach(inp => { inp.addEventListener('input', () => calc(sheet)); inp.addEventListener('change', () => calc(sheet)); });
      $('[data-apply]', sheet).onclick = () => {
        const v = calc(sheet); snapshot(m);
        v.forEach((p, i) => { if (p) { m.scores[i] += p; m.log.push({ team: i, who: m.teams[i].name, label: 'mão', pts: p, t: Date.now() }); } });
        closeSheet(); Sound.point(); render(); checkTeamWin();
      };
    });
  }

  function customSheet(team) {
    const m = S.match;
    openSheet(`<h3>${esc(m.teams[team].name)} · outro valor</h3>
      <div class="field"><label>Pontos (use − pra tirar)</label><input type="number" inputmode="numeric" data-val placeholder="ex.: 2 ou -3" autofocus></div>
      <div class="row"><button class="btn ghost" data-close>Cancelar</button><button class="btn" data-apply style="flex:1">Lançar</button></div>`, sheet => {
      $('[data-apply]', sheet).onclick = () => { const v = parseInt($('[data-val]', sheet).value); if (!v) return; closeSheet(); addPoints(team, v, 'outro'); };
      setTimeout(() => $('[data-val]', sheet).focus(), 100);
    });
  }

  function settingsSheet() {
    const m = S.match;
    openSheet(`<h3>Partida</h3>
      ${m.teams ? m.teams.map((t, i) => `<div class="field"><label>Dupla ${i + 1}</label><input data-tn="${i}" value="${esc(t.name)}" maxlength="14"></div>`).join('') : ''}
      ${m.game !== 'truco' ? `<div class="field"><label>Meta de pontos</label><input type="number" inputmode="numeric" data-target value="${m.target}"></div>` : ''}
      <div class="row mt"><button class="btn ghost" data-close>Voltar</button><button class="btn" data-apply style="flex:1">Salvar</button></div>
      <button class="btn danger block mt" data-abandon>Encerrar partida sem vencedor</button>`, sheet => {
      $('[data-apply]', sheet).onclick = () => {
        if (m.teams) $$('[data-tn]', sheet).forEach(inp => { m.teams[+inp.dataset.tn].name = inp.value.trim() || m.teams[+inp.dataset.tn].name; });
        const t = $('[data-target]', sheet); if (t && +t.value > 0) m.target = +t.value;
        closeSheet(); render();
      };
      $('[data-abandon]', sheet).onclick = () => { if (confirm('Encerrar a partida? Não vai pro Hall da Fama.')) { closeSheet(); S.match = null; S.view = 'home'; S.tab = 'home'; render(); } };
    });
  }

  // ---------- sheet genérico ----------
  function openSheet(html, init) {
    closeSheet();
    const bd = document.createElement('div'); bd.className = 'sheet-backdrop'; bd.id = 'sheet';
    bd.innerHTML = `<div class="sheet">${html}</div>`;
    document.body.appendChild(bd);
    bd.addEventListener('click', e => { if (e.target === bd) closeSheet(); });
    const sheet = $('.sheet', bd);
    $$('[data-close]', sheet).forEach(b => b.onclick = closeSheet);
    init && init(sheet);
  }
  function closeSheet() { const s = $('#sheet'); s && s.remove(); }

  // ========== HALL DA FAMA ==========
  function renderHall() {
    const wins = {}, played = {};
    for (const h of S.history) {
      const ws = h.winnerPlayers && h.winnerPlayers.length ? h.winnerPlayers : [h.winner];
      const ls = h.loserPlayers && h.loserPlayers.length ? h.loserPlayers : [h.loser];
      for (const n of ws) { if (!n) continue; wins[n] = (wins[n] || 0) + 1; played[n] = (played[n] || 0) + 1; }
      for (const n of ls) { if (!n) continue; played[n] = (played[n] || 0) + 1; }
    }
    const rank = Object.entries(played).map(([n, p]) => ({ n, p, w: wins[n] || 0 })).sort((a, b) => b.w - a.w || a.p - b.p);
    const medal = i => ['🥇', '🥈', '🥉'][i] || (i + 1);
    return `<div class="topbar"><h2>🏆 Hall da Fama</h2>${S.history.length ? '<button class="btn sm ghost" data-clear-hist>Limpar</button>' : ''}</div>
      ${rank.length ? rank.slice(0, 15).map((r, i) => `<div class="hallrow ${i === 0 ? 'first' : ''}"><div class="pos">${medal(i)}</div><div class="n">${esc(r.n)}<small>${r.p} partida${r.p > 1 ? 's' : ''} · ${r.p ? Math.round(r.w / r.p * 100) : 0}% de vitórias</small></div><div class="w">${r.w} 🏆</div></div>`).join('')
        : `<div class="card dark center"><p style="font-size:40px;margin:0">🃏</p><p>Ninguém ganhou nada ainda.<br>Termina uma partida pra aparecer aqui.</p></div>`}
      ${S.history.length ? `<h3 class="mt mb" style="font-size:14px;letter-spacing:2px;text-transform:uppercase;opacity:.7">Últimas partidas</h3>
        ${S.history.slice(0, 30).map(h => `<div class="matchrow"><div class="g ${h.game}">${GAMES[h.game].name.slice(0, 3).toUpperCase()}</div><div><b>${esc(h.winner)}</b> venceu ${esc(h.loser || '')}<br><small class="muted">${esc(h.score)} · ${fmtDate(h.date)}</small></div></div>`).join('')}` : ''}`;
  }

  // ========== REGRAS ==========
  function renderRules() {
    const g = RULES[S.rulesGame];
    return `<div class="topbar"><h2>📖 Regras oficiais</h2></div>
      <div class="rules-nav">${Object.entries(RULES).map(([k, r]) => `<button class="${k === S.rulesGame ? 'on' : ''}" data-rg="${k}">${r.title}</button>`).join('')}</div>
      <div class="rule-head">${ART[S.rulesGame].replace('class="art"', '')}<div><h2 style="color:${g.color}">${g.title}</h2><p>${g.subtitle}</p></div></div>
      <div class="rule">${g.sections.map((s, i) => `<details ${i === 0 ? 'open' : ''}><summary>${s.t}</summary><div class="body">${s.h}</div></details>`).join('')}</div>
      <p class="small muted center">As regras variam de mesa pra mesa — o que vale é o combinado antes de dar as cartas. 😉</p>`;
  }

  // ========== BIND ==========
  function bind() {
    $$('[data-new]').forEach(b => b.onclick = () => { Sound.unlock(); Sound.click(); newSetup(b.dataset.new); S.view = 'setup'; render(); });
    const rs = $('[data-resume]'); if (rs) rs.onclick = () => { S.view = 'game'; render(); };
    $$('[data-home]').forEach(b => b.onclick = () => { S.view = 'home'; S.tab = 'home'; render(); });

    // setup
    $$('[data-seg]').forEach(seg => $$('button', seg).forEach(b => b.onclick = () => {
      const k = seg.dataset.seg, v = b.dataset.v; setup[k] = isNaN(v) ? v : +v;
      if (k === 'variant') setup.target = v === 'gaucho' ? 24 : 12;
      Sound.click(); render();
    }));
    $$('[data-team]').forEach(i => i.oninput = () => setup.teams[+i.dataset.team].name = i.value);
    $$('[data-player]').forEach(i => i.oninput = () => { const [t, p] = i.dataset.player.split('-'); setup.teams[+t].players[+p] = i.value; });
    $$('[data-pl]').forEach(i => i.oninput = () => setup.players[+i.dataset.pl] = i.value);
    $$('[data-rm]').forEach(b => b.onclick = () => { setup.players.splice(+b.dataset.rm, 1); render(); });
    const add = $('[data-add]'); if (add) add.onclick = () => { if (setup.players.length >= 8) return toast('Máximo 8 jogadores'); setup.players.push(''); render(); setTimeout(() => { const ins = $$('[data-pl]'); ins[ins.length - 1].focus(); }, 50); };
    const st = $('[data-start]'); if (st) st.onclick = startMatch;

    // game
    const un = $('[data-undo]'); if (un) un.onclick = undo;
    const sd = $('[data-sound]'); if (sd) sd.onclick = () => { Sound.unlock(); const on = Sound.toggle(); sd.textContent = on ? '🔊' : '🔇'; if (on) Sound.point(); };
    const sg = $('[data-settings]'); if (sg) sg.onclick = settingsSheet;
    $$('[data-pts]').forEach(b => b.onclick = () => {
      const team = +b.dataset.team, v = b.dataset.pts, label = b.dataset.label, kind = b.dataset.kind;
      if (v === 'custom') return customSheet(team);
      if (v === 'falta') { const f = faltaEnvido(S.match, team); return addPoints(team, f, `Falta envido (${f})`); }
      addPoints(team, +v, label, kind);
    });
    const hand = $('[data-hand]'); if (hand) hand.onclick = () => { const g = S.match.game; (g === 'pontinho' ? pontinhoSheet : g === 'tressete' ? tresseteSheet : canastraSheet)(); };
    $$('[data-pp]').forEach(r => r.onclick = e => { if (e.target.closest('[data-back]')) return; pontinhoAdjust(+r.dataset.pp); });
    $$('[data-back]').forEach(b => b.onclick = () => pontinhoBack(+b.dataset.back));

    // hall
    const ch = $('[data-clear-hist]'); if (ch) ch.onclick = () => { if (confirm('Apagar todo o histórico?')) { S.history = []; render(); } };

    // rules
    $$('[data-rg]').forEach(b => b.onclick = () => { S.rulesGame = b.dataset.rg; Sound.click(); render(); });

    // install
    setupInstall();
  }

  // ---------- instalação (PWA) ----------
  let deferredPrompt = null;
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; setupInstall(); });
  function setupInstall() {
    const box = $('#install'); if (!box) return;
    const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    let dismissed = false; try { dismissed = localStorage.getItem('carteado:install') === 'no'; } catch (e) {}
    if (standalone || dismissed) return;
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const txt = $('#install-txt'), btn = $('#install-btn');
    if (deferredPrompt) { txt.textContent = 'instala como app e usa offline na mesa.'; btn.classList.remove('hidden'); btn.onclick = async () => { deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; box.classList.add('hidden'); }; }
    else if (isIOS) { txt.textContent = 'no Safari toque em Compartilhar ⬆️ e depois em "Adicionar à Tela de Início".'; btn.classList.add('hidden'); }
    else { txt.textContent = 'no menu do navegador toque em "Instalar app" ou "Adicionar à tela inicial".'; btn.classList.add('hidden'); }
    box.classList.remove('hidden');
    $('#install-dismiss').onclick = () => { try { localStorage.setItem('carteado:install', 'no'); } catch (e) {} box.classList.add('hidden'); };
  }

  // ---------- start ----------
  if (S.view === 'setup') S.view = 'home';
  if (S.view === 'game' && (!S.match || S.match.finished)) S.view = 'home';
  render();
  document.addEventListener('touchstart', () => Sound.unlock(), { once: true, passive: true });
})();
