"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.25;
/** Padding interno da área rolável (p-4 = 16px). */
const SCROLL_PAD = 16;

type WorldMapZoomModalProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
};

function clampZoom(value: number) {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value));
}

function centerScroll(el: HTMLDivElement | null) {
  if (!el) return;
  const { scrollWidth, clientWidth, scrollHeight, clientHeight } = el;
  el.scrollLeft = Math.max(0, (scrollWidth - clientWidth) / 2);
  el.scrollTop = Math.max(0, (scrollHeight - clientHeight) / 2);
}

/** Estimativa da área útil do mapa antes do primeiro layout / ResizeObserver. */
function fallbackViewport(): { w: number; h: number } {
  if (typeof window === "undefined") return { w: 800, h: 500 };
  const w = Math.min(window.innerWidth * 0.9, window.innerWidth) - 48;
  const h = Math.max(200, window.innerHeight * 0.9 - 180);
  return { w: Math.max(100, w), h: Math.max(100, h) };
}

export function WorldMapZoomModal({
  src,
  alt,
  width,
  height,
  sizes,
  priority,
}: WorldMapZoomModalProps) {
  const [open, setOpen] = useState(false);
  /** 1 = mapa inteiro encaixa na área; &gt;1 aproxima e permite rolar. */
  const [zoom, setZoom] = useState(1);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(zoom);

  /** Pinch: distância inicial, zoom no início, scroll inicial (mobile). */
  const pinchRef = useRef<{
    dist: number;
    zoom: number;
    scrollL: number;
    scrollT: number;
  } | null>(null);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  useLayoutEffect(() => {
    zoomRef.current = zoom;
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  const measureViewport = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (w > 0 && h > 0) {
      setViewport({ w, h });
    }
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    measureViewport();
    const id = requestAnimationFrame(() => {
      measureViewport();
      requestAnimationFrame(measureViewport);
    });
    return () => cancelAnimationFrame(id);
  }, [open, measureViewport]);

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => measureViewport());
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, measureViewport]);

  const fb = fallbackViewport();
  const vw = viewport.w > 0 ? viewport.w : fb.w;
  const vh = viewport.h > 0 ? viewport.h : fb.h;

  const availW = Math.max(0, vw - SCROLL_PAD * 2);
  const availH = Math.max(0, vh - SCROLL_PAD * 2);

  const fitScale =
    availW > 0 && availH > 0 ? Math.min(availW / width, availH / height) : 0;

  const scale = fitScale * zoom;
  const displayW = width * scale;
  const displayH = height * scale;

  useLayoutEffect(() => {
    if (!open || fitScale === 0) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => centerScroll(scrollRef.current));
    });
    return () => cancelAnimationFrame(id);
  }, [open, zoom, viewport.w, viewport.h, fitScale, displayW, displayH]);

  /** Pinch (mobile) + roda do mouse (wheel com passive: false para o zoom). */
  useEffect(() => {
    if (!open) {
      pinchRef.current = null;
      return;
    }
    const el = scrollRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 2) return;
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
      pinchRef.current = {
        dist,
        zoom: zoomRef.current,
        scrollL: el.scrollLeft,
        scrollT: el.scrollTop,
      };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length < 2 || !pinchRef.current) return;
      e.preventDefault();
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
      if (dist < 1) return;

      const start = pinchRef.current;
      const ratio = dist / start.dist;
      const newZoom = clampZoom(start.zoom * ratio);
      const zr = newZoom / start.zoom;

      const rect = el.getBoundingClientRect();
      const mx = (t0.clientX + t1.clientX) / 2 - rect.left;
      const my = (t0.clientY + t1.clientY) / 2 - rect.top;

      el.scrollLeft = start.scrollL + (mx - el.clientWidth / 2) * (zr - 1);
      el.scrollTop = start.scrollT + (my - el.clientHeight / 2) * (zr - 1);
      setZoom(newZoom);
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) pinchRef.current = null;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((z) => clampZoom(z - e.deltaY * 0.002));
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      el.removeEventListener("wheel", onWheel);
    };
  }, [open]);

  const modal =
    open &&
    createPortal(
      <div
        className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="world-map-modal-title"
      >
        <button
          type="button"
          className="absolute inset-0 cursor-default bg-black/65 backdrop-blur-[2px]"
          onClick={close}
          aria-label="Fechar"
        />
        {/* Altura explícita para flex-1 na área rolável receber dimensões &gt; 0 */}
        <div className="relative z-10 flex h-[min(90vh,90dvh)] max-h-[90vh] max-w-[90vw] w-full min-h-0 flex-col overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 shadow-2xl">
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-800 px-3 py-3 sm:px-4">
            <h2
              id="world-map-modal-title"
              className="truncate text-sm font-medium text-zinc-100 sm:text-base"
            >
              {alt}
            </h2>
            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
              <div className="flex items-center gap-1 rounded-lg bg-zinc-800/80 p-1">
                <button
                  type="button"
                  onClick={() => setZoom((z) => clampZoom(z - ZOOM_STEP))}
                  className="flex h-9 min-w-9 items-center justify-center rounded-md text-lg font-medium text-zinc-200 transition hover:bg-zinc-700 hover:text-white"
                  aria-label="Diminuir zoom"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  className="px-1.5 text-[11px] text-zinc-400 hover:text-zinc-200 sm:px-2 sm:text-xs"
                >
                  <span className="sm:hidden">Ajustar</span>
                  <span className="hidden sm:inline">Ajustar à tela</span>
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => clampZoom(z + ZOOM_STEP))}
                  className="flex h-9 min-w-9 items-center justify-center rounded-md text-lg font-medium text-zinc-200 transition hover:bg-zinc-700 hover:text-white"
                  aria-label="Aumentar zoom"
                >
                  +
                </button>
              </div>
              <label className="flex min-w-[120px] max-w-[40vw] items-center gap-2 sm:min-w-[160px]">
                <span className="sr-only">Nível de zoom</span>
                <input
                  type="range"
                  min={ZOOM_MIN}
                  max={ZOOM_MAX}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(clampZoom(Number(e.target.value)))}
                  className="h-2 w-full cursor-pointer accent-zinc-400"
                />
              </label>
              <span className="w-12 tabular-nums text-right text-xs text-zinc-400 sm:text-sm">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={close}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-200 transition hover:bg-zinc-700 hover:text-white"
                aria-label="Fechar"
              >
                <span className="text-xl leading-none" aria-hidden>
                  ×
                </span>
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="min-h-0 min-w-0 flex-1 basis-0 overflow-auto overscroll-contain touch-pan-x touch-pan-y [-webkit-overflow-scrolling:touch]"
          >
            <div className="flex min-h-full min-w-full items-center justify-center p-4">
              {fitScale > 0 && displayW > 0 && displayH > 0 && (
                <div
                  className="relative shrink-0"
                  style={{ width: displayW, height: displayH }}
                >
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    className="select-none object-contain"
                    sizes="(max-width: 1024px) 90vw, min(90vw, 896px)"
                    priority
                    draggable={false}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>,
      document.body,
    );

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setZoom(1);
          setOpen(true);
        }}
        className="group w-full cursor-zoom-in rounded-lg border-0 bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
        aria-label={`Abrir ${alt} em janela com zoom`}
      >
        <span className="relative block overflow-hidden rounded-lg ring-1 ring-zinc-200 transition group-hover:ring-zinc-400 dark:ring-zinc-700 dark:group-hover:ring-zinc-500">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="h-auto w-full object-contain"
            sizes={sizes}
            priority={priority}
          />
        </span>
      </button>
      {modal}
    </>
  );
}
