import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number; // depth
  size: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
}

export const ShowroomMeshBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Color palette: Neon Cyan (#00F0FF), Aurora Purple (#7B2FFF), Gold (#FFD700), and Starlight
    const palette = ['#00F0FF', '#7B2FFF', '#FFD700', '#A5F3FC', '#C084FC'];

    const particleCount = Math.min(75, Math.floor((width * height) / 18000));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const z = Math.random() * 0.8 + 0.2;
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        z,
        size: (Math.random() * 2 + 0.8) * z,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.4 * z,
        vy: (Math.random() - 0.5) * 0.4 * z,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: Math.random() * 0.5 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.01;
      // Smooth mouse damping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Render connected neural constellation lines for close particles
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.15;
            ctx.strokeStyle = `rgba(0, 240, 255, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Render quantum floating particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Subtle mouse repulsion / gravitational pull
        const mdx = mouse.x - p.x;
        const mdy = mouse.y - p.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 140) {
          const force = (1 - mdist / 140) * 0.8;
          p.x -= (mdx / mdist) * force;
          p.y -= (mdy / mdist) * force;
        }

        // Screen wrap
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const dynamicAlpha = p.alpha * (0.7 + 0.3 * Math.sin(time * 3 + i));

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, dynamicAlpha));
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0A0F1E]">
      {/* Dynamic 3D Aurora Mesh Gradient Blobs */}
      <div 
        className="absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full blur-[140px] opacity-35 animate-pulse"
        style={{
          background: 'radial-gradient(circle, #7B2FFF 0%, rgba(123, 47, 255, 0) 70%)',
          animationDuration: '9s'
        }}
      />
      <div 
        className="absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full blur-[150px] opacity-30 animate-pulse"
        style={{
          background: 'radial-gradient(circle, #00F0FF 0%, rgba(0, 240, 255, 0) 70%)',
          animationDuration: '12s',
          animationDelay: '2s'
        }}
      />
      <div 
        className="absolute bottom-10 left-1/3 w-[550px] h-[550px] rounded-full blur-[130px] opacity-25"
        style={{
          background: 'radial-gradient(circle, #FFD700 0%, rgba(255, 215, 0, 0) 70%)',
        }}
      />

      {/* Cybernetic Laser Grid Floor */}
      <div className="absolute inset-x-0 bottom-0 h-96 laser-grid-floor opacity-30 pointer-events-none" />

      {/* Interactive Canvas Particle System */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
};
