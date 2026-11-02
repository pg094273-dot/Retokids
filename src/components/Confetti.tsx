import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface ConfettiHandle {
  burst: () => void;
}

export const Confetti = forwardRef<ConfettiHandle>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  interface Particle {
    x: number;
    y: number;
    r: number;
    dx: number;
    dy: number;
    color: string;
    tilt: number;
    tiltAngle: number;
    tiltAngleInc: number;
  }

  const particlesRef = useRef<Particle[]>([]);

  const burst = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const colors = ['#6366f1', '#f59e0b', '#10b981', '#ec4899', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6'];
    const newParticles: Particle[] = [];

    const centerX = canvas.width / 2;
    const centerY = canvas.height * 0.45;

    for (let i = 0; i < 75; i++) {
      newParticles.push({
        x: centerX + (Math.random() - 0.5) * 60,
        y: centerY + (Math.random() - 0.5) * 40,
        r: Math.random() * 6 + 4,
        dx: (Math.random() - 0.5) * 14,
        dy: (Math.random() - 0.75) * 16,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10,
        tiltAngle: 0,
        tiltAngleInc: Math.random() * 0.08 + 0.04,
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];

    if (!animFrameId.current) {
      animate();
    }
  };

  useImperativeHandle(ref, () => ({
    burst,
  }));

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particlesRef.current.forEach((p) => {
      p.tiltAngle += p.tiltAngleInc;
      p.y += (Math.cos(p.tiltAngle) + 1 + p.r / 2) / 2 + 3.5;
      p.x += p.dx;
      p.dx *= 0.985;
      p.dy += 0.15; // gravedad suave

      if (p.y < canvas.height + 20) {
        alive = true;
      }

      ctx.beginPath();
      ctx.lineWidth = p.r / 2;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
      ctx.stroke();
    });

    particlesRef.current = particlesRef.current.filter((p) => p.y < canvas.height + 20);

    if (alive && particlesRef.current.length > 0) {
      animFrameId.current = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animFrameId.current = null;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
});

Confetti.displayName = 'Confetti';
