"use client";

import { useEffect, useRef } from "react";

type MindMapUniverseBackdropProps = {
  width: number;
  height: number;
};

/**
 * Fundo “universo”: gradiente profundo, nebulosas com blur em movimento lento
 * e camada de estrelas com drift + twinkle (canvas).
 */
export function MindMapUniverseBackdrop({
  width,
  height,
}: MindMapUniverseBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (width <= 0 || height <= 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
      2,
    );
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    type Star = {
      x: number;
      y: number;
      r: number;
      phase: number;
      speed: number;
      vx: number;
      vy: number;
    };

    const count = Math.min(
      240,
      Math.max(80, Math.floor((width * height) / 8500)),
    );
    const stars: Star[] = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.35 + 0.25,
        phase: Math.random() * Math.PI * 2,
        speed: 0.55 + Math.random() * 1.35,
        vx: (Math.random() - 0.5) * 0.055,
        vy: (Math.random() - 0.5) * 0.055,
      });
    }

    let raf = 0;
    let t = 0;

    const draw = () => {
      t += 1 / 55;
      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < -4) s.x = width + 4;
        if (s.x > width + 4) s.x = -4;
        if (s.y < -4) s.y = height + 4;
        if (s.y > height + 4) s.y = -4;

        const tw =
          0.38 +
          0.62 * ((Math.sin(t * s.speed + s.phase) * 0.5 + 0.5) * 0.92 + 0.08);
        const alpha = 0.2 + tw * 0.78;
        ctx.beginPath();
        ctx.fillStyle = `rgba(236, 242, 255, ${alpha})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [width, height]);

  if (width <= 0 || height <= 0) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      aria-hidden
    >
      <div className="absolute inset-0 bg-linear-to-br from-[#05030d] via-[#0a0635] to-[#160d2e]" />
      <div className="pointer-events-none absolute -left-[22%] top-[-32%] h-[88%] w-[72%] animate-[mindmap-aurora_34s_ease-in-out_infinite] rounded-full bg-violet-500/20 blur-[96px]" />
      <div className="pointer-events-none absolute -right-[12%] bottom-[-28%] h-[72%] w-[58%] animate-[mindmap-aurora_42s_ease-in-out_infinite_reverse] rounded-full bg-amber-400/12 blur-[110px]" />
      <div className="pointer-events-none absolute left-[25%] top-[38%] h-[45%] w-[52%] animate-[mindmap-float_52s_ease-in-out_infinite] rounded-full bg-cyan-400/8 blur-[88px]" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full mix-blend-screen opacity-[0.92]"
      />
    </div>
  );
}
