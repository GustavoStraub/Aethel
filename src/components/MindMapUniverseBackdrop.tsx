"use client";

import { useEffect, useRef } from "react";

/**
 * Fundo "universo": gradiente profundo, nebulosas com blur em movimento lento
 * e camada de estrelas com drift + twinkle (canvas).
 * Não depende de props de dimensão — mede a si mesmo via ResizeObserver.
 */
export function MindMapUniverseBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    type Star = {
      x: number;
      y: number;
      r: number;
      phase: number;
      speed: number;
      vx: number;
      vy: number;
    };

    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let t = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = (w: number, h: number) => {
      width = w;
      height = h;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(240, Math.max(80, Math.floor((w * h) / 8500)));
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.35 + 0.25,
          phase: Math.random() * Math.PI * 2,
          speed: 0.55 + Math.random() * 1.35,
          vx: (Math.random() - 0.5) * 0.055,
          vy: (Math.random() - 0.5) * 0.055,
        });
      }
    };

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width: w, height: h } = entry.contentRect;
      if (w > 0 && h > 0) resize(w, h);
    });
    ro.observe(canvas);

    // Leitura inicial
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx || width <= 0 || height <= 0) {
        raf = requestAnimationFrame(draw);
        return;
      }
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
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
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
