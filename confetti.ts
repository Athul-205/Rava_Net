/**
 * Custom 🌾 Rava Grain & Wheat Confetti Emitter
 * Spawns flying rava grains and wheat emoji confetti across the screen!
 */

export function triggerRavaConfetti() {
  const canvas = document.createElement('canvas');
  canvas.id = 'rava-confetti-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    vRot: number;
    size: number;
    type: 'emoji' | 'grain' | 'sparkle';
    char: string;
    color: string;
    opacity: number;
  }

  const emojis = ['🌾', '🌾', '✨', '🥣', '🌾', '🟡'];
  const colors = ['#f59e0b', '#fbbf24', '#fef3c7', '#d97706', '#fcd34d'];
  const particles: Particle[] = [];

  // Spawn 90 particles
  for (let i = 0; i < 90; i++) {
    const isEmoji = Math.random() > 0.45;
    particles.push({
      x: width * 0.5 + (Math.random() - 0.5) * 300,
      y: height * 0.4 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 18,
      vy: -Math.random() * 14 - 6,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.2,
      size: isEmoji ? Math.random() * 16 + 20 : Math.random() * 5 + 3,
      type: isEmoji ? 'emoji' : 'grain',
      char: emojis[Math.floor(Math.random() * emojis.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
    });
  }

  let startTime = performance.now();
  const duration = 3800; // ms

  function animate(now: number) {
    const elapsed = now - startTime;
    if (elapsed > duration || !ctx) {
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      return;
    }

    ctx.clearRect(0, 0, width, height);
    const progress = elapsed / duration;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.985; // air drag
      p.rotation += p.vRot;
      p.opacity = Math.max(0, 1 - progress * 1.1);

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      if (p.type === 'emoji') {
        ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.char, 0, 0);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.65, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}
