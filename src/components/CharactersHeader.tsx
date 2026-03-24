"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Character } from "@/data/characters";
import { siteContentWidthClass } from "@/lib/siteLayout";

type CharactersHeaderProps = {
  characters: Character[];
  /** Rótulo da faixa (padrão: Personagens). */
  title?: string;
};

export function CharactersHeader({
  characters,
  title = "Personagens",
}: CharactersHeaderProps) {
  const [selected, setSelected] = useState<Character | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selected]);

  const modal =
    selected &&
    createPortal(
      <div
        className="fixed inset-0 z-100 flex min-h-dvh items-center justify-center p-4 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="character-modal-title"
      >
        <button
          type="button"
          className="absolute inset-0 cursor-default bg-black/65 backdrop-blur-[2px]"
          onClick={() => setSelected(null)}
          aria-label="Fechar"
        />
        <div className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col items-center gap-4 overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-950 px-4 pb-6 pt-14 shadow-2xl sm:px-6 sm:pb-8">
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-zinc-200 transition hover:bg-zinc-700 hover:text-white"
            aria-label="Fechar"
          >
            <span className="text-xl leading-none" aria-hidden>
              ×
            </span>
          </button>
          <div className="relative h-[min(70vh,680px)] w-full max-w-3xl shrink-0">
            <Image
              src={selected.src}
              alt={selected.name}
              fill
              className="object-contain object-center"
              sizes="(max-width: 1024px) 90vw, 896px"
              priority
            />
          </div>
          <div className="text-center text-zinc-100">
            <p id="character-modal-title" className="text-lg font-semibold">
              {selected.name}
            </p>
            <p className="mt-1 text-sm text-zinc-400">{selected.lv}</p>
          </div>
        </div>
      </div>,
      document.body,
    );

  return (
    <>
      <header className="w-full shrink-0 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className={`${siteContentWidthClass} py-6`}>
          <h1 className="mb-6 text-center text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            {title}
          </h1>

          <ul className="flex flex-wrap items-start justify-center gap-10 sm:gap-12">
            {characters.map((c) => (
              <li
                key={`${c.src}-${c.name}`}
                className="w-[min(100%,200px)] max-w-[200px] shrink-0 sm:w-[220px] sm:max-w-[220px]"
              >
                <button
                  type="button"
                  onClick={() => setSelected(c)}
                  className="group w-full cursor-zoom-in rounded-lg border-0 bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
                  aria-label={`Ampliar retrato de ${c.name}`}
                >
                  <figure className="flex flex-col items-center gap-3 text-center">
                    <div className="relative aspect-3/4 w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 shadow-sm transition group-hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:group-hover:border-zinc-600">
                      <Image
                        src={c.src}
                        alt=""
                        fill
                        className="object-contain object-center"
                        sizes="(max-width: 640px) 200px, 220px"
                      />
                    </div>
                    <figcaption className="w-full space-y-0.5">
                      <p className="text-sm font-medium leading-tight">
                        {c.name}
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        {c.lv}
                      </p>
                    </figcaption>
                  </figure>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </header>
      {modal}
    </>
  );
}
