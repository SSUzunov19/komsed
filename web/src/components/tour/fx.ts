/** Леки ефекти за тура: „блип" звук и конфети — без външни библиотеки. */

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new Ctor();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/** Кратко тихо „блип" звукче (като при писане на текст). */
export function blip(freq = 520) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq + Math.round((freq / 12) * (Math.sin(ctx.currentTime * 7) || 0));
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.07);
}

/** Конфети експлозия за ~2.5 секунди. */
export function confetti() {
  if (typeof window === 'undefined') return;
  const canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:10000;';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const colors = ['#048A81', '#2E4057', '#F2A9A0', '#F5C451', '#6FC8C0', '#ffffff'];
  const N = 160;
  const parts = Array.from({ length: N }, (_, i) => ({
    x: canvas.width / 2 + (Math.cos(i) * canvas.width) / 6,
    y: canvas.height / 2,
    vx: (((i * 73) % 100) / 100 - 0.5) * 16,
    vy: -8 - (((i * 37) % 100) / 100) * 10,
    size: 6 + ((i * 13) % 8),
    color: colors[i % colors.length],
    rot: (i % 360) * (Math.PI / 180),
    vr: (((i * 17) % 100) / 100 - 0.5) * 0.4,
  }));

  const start = performance.now();
  function frame(now: number) {
    const elapsed = now - start;
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of parts) {
      p.vy += 0.35; // гравитация
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.rot += p.vr;
      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.rot);
      ctx!.fillStyle = p.color;
      ctx!.globalAlpha = Math.max(0, 1 - elapsed / 2500);
      ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx!.restore();
    }
    if (elapsed < 2500) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
    }
  }
  requestAnimationFrame(frame);
}
