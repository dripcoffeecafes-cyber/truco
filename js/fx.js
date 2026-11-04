/* ============================================================
   FX — confete, fogos, sons sintetizados, vibração, flash
   Tudo gerado em código: nada de arquivo de áudio/imagem externo.
   ============================================================ */
const FX = (() => {
  const canvas = document.getElementById('fx');
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, particles = [], running = false, dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = innerWidth * dpr;
    H = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
  }
  addEventListener('resize', resize); resize();

  const COLORS = ['#f2b134', '#ffd369', '#e5383b', '#3a86ff', '#2ec4b6', '#ff5d8f', '#fff7e6', '#9d4edd', '#ff8c42'];
  const rnd = (a, b) => a + Math.random() * (b - a);

  function confetti(n = 160, origin) {
    const ox = origin ? origin.x * dpr : W / 2, oy = origin ? origin.y * dpr : H * 0.35;
    for (let i = 0; i < n; i++) {
      const a = rnd(0, Math.PI * 2), sp = rnd(4, 16) * dpr;
      particles.push({
        type: 'c', x: ox, y: oy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 6 * dpr,
        w: rnd(6, 12) * dpr, h: rnd(8, 18) * dpr, rot: rnd(0, 7), vr: rnd(-.25, .25),
        color: COLORS[(Math.random() * COLORS.length) | 0], life: rnd(90, 180), g: .28 * dpr, drag: .985
      });
    }
    start();
  }

  function rain(n = 120) {
    for (let i = 0; i < n; i++) {
      particles.push({
        type: 'c', x: rnd(0, W), y: rnd(-H * .3, -10), vx: rnd(-1, 1) * dpr, vy: rnd(2, 6) * dpr,
        w: rnd(6, 12) * dpr, h: rnd(8, 18) * dpr, rot: rnd(0, 7), vr: rnd(-.2, .2),
        color: COLORS[(Math.random() * COLORS.length) | 0], life: rnd(200, 320), g: .05 * dpr, drag: 1
      });
    }
    start();
  }

  function firework(x, y) {
    const col = COLORS[(Math.random() * COLORS.length) | 0];
    for (let i = 0; i < 70; i++) {
      const a = (Math.PI * 2 * i) / 70, sp = rnd(3, 9) * dpr;
      particles.push({ type: 'f', x: x * dpr, y: y * dpr, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: rnd(2, 4) * dpr, color: col, life: rnd(50, 80), g: .08 * dpr, drag: .96 });
    }
    start();
  }

  function fireworksShow(times = 6) {
    let i = 0;
    const t = setInterval(() => {
      firework(rnd(innerWidth * .15, innerWidth * .85), rnd(innerHeight * .15, innerHeight * .5));
      Sound.pop();
      if (++i >= times) clearInterval(t);
    }, 380);
  }

  function start() { if (!running) { running = true; requestAnimationFrame(loop); } }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles = particles.filter(p => p.life > 0 && p.y < H + 40);
    for (const p of particles) {
      p.vy += p.g; p.vx *= p.drag; p.vy *= p.drag; p.x += p.vx; p.y += p.vy; p.life--;
      if (p.type === 'c') {
        p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color; ctx.globalAlpha = Math.min(1, p.life / 40);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot * 2)));
        ctx.restore();
      } else {
        ctx.globalAlpha = Math.min(1, p.life / 30);
        ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    if (particles.length) requestAnimationFrame(loop); else { running = false; ctx.clearRect(0, 0, W, H); }
  }

  function flash(text, color) {
    const el = document.createElement('div');
    el.className = 'flash'; el.textContent = text;
    if (color) el.style.color = color;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 950);
  }

  function vibrate(pattern) { try { navigator.vibrate && navigator.vibrate(pattern); } catch (e) {} }

  return { confetti, rain, firework, fireworksShow, flash, vibrate };
})();

/* ---------- SONS (Web Audio, sintetizados) ---------- */
const Sound = (() => {
  let ac = null, enabled = true;
  try { enabled = localStorage.getItem('carteado:sound') !== 'off'; } catch (e) {}
  function ctx() {
    if (!ac) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; ac = new AC(); }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }
  function tone(freq, t0, dur, type = 'square', vol = .18, slide) {
    const a = ctx(); if (!a || !enabled) return;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, a.currentTime + t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, a.currentTime + t0 + dur);
    g.gain.setValueAtTime(0, a.currentTime + t0);
    g.gain.linearRampToValueAtTime(vol, a.currentTime + t0 + .01);
    g.gain.exponentialRampToValueAtTime(.001, a.currentTime + t0 + dur);
    o.connect(g).connect(a.destination);
    o.start(a.currentTime + t0); o.stop(a.currentTime + t0 + dur + .05);
  }
  function noise(t0, dur, vol = .2) {
    const a = ctx(); if (!a || !enabled) return;
    const buf = a.createBuffer(1, a.sampleRate * dur, a.sampleRate);
    const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const s = a.createBufferSource(); s.buffer = buf;
    const g = a.createGain(); g.gain.value = vol;
    const f = a.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800;
    s.connect(f).connect(g).connect(a.destination); s.start(a.currentTime + t0);
  }
  const S = {
    get enabled() { return enabled; },
    toggle() { enabled = !enabled; try { localStorage.setItem('carteado:sound', enabled ? 'on' : 'off'); } catch (e) {} return enabled; },
    unlock() { ctx(); },
    click() { tone(900, 0, .05, 'square', .06); },
    point() { tone(660, 0, .08, 'square', .12); tone(990, .08, .12, 'square', .12); },
    minus() { tone(300, 0, .15, 'sawtooth', .1, 150); },
    pop() { noise(0, .12, .25); tone(200, 0, .1, 'sine', .2, 60); },
    truco() { // grito de desafio
      tone(220, 0, .12, 'sawtooth', .22, 440); tone(330, .12, .12, 'sawtooth', .22, 660); tone(440, .24, .35, 'square', .2);
    },
    fanfare() { // tã-tã-tã-tãããã
      const n = [523, 523, 523, 659, 784, 659, 784, 1046];
      const d = [.12, .12, .12, .25, .25, .12, .25, .6];
      let t = 0; n.forEach((f, i) => { tone(f, t, d[i], 'square', .16); tone(f / 2, t, d[i], 'triangle', .12); t += d[i] + .03; });
      noise(t - .2, .4, .3);
    },
    sad() { tone(392, 0, .3, 'triangle', .15); tone(370, .3, .3, 'triangle', .15); tone(349, .6, .6, 'triangle', .15, 300); },
    drum() { tone(120, 0, .2, 'sine', .4, 40); noise(0, .08, .15); }
  };
  return S;
})();
