"use client";

import { Literata } from "next/font/google";
import { useCallback, useEffect, useState } from "react";
import { CampaignRichText } from "@/components/CampaignRichText";
import type { SessionEntry } from "@/data/sessions";

const literata = Literata({
  subsets: ["latin"],
  variable: "--font-literata",
});

type SessionBookProps = {
  sessions: SessionEntry[];
};

export function SessionBook({ sessions: pages }: SessionBookProps) {
  const [index, setIndex] = useState(0);
  const total = pages.length;
  const current = pages[index];

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(total - 1, i + 1));
  }, [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  if (total === 0 || !current) {
    return (
      <p className="text-zinc-600 dark:text-zinc-400">
        Nenhuma sessão registrada ainda.
      </p>
    );
  }

  const atStart = index === 0;
  const atEnd = index === total - 1;

  return (
    <div className={`${literata.className} space-y-6`}>
      <nav
        className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between"
        aria-label="Navegação entre sessões"
      >
        <button
          type="button"
          onClick={goPrev}
          disabled={atStart}
          className="rounded-lg border border-amber-900/25 bg-amber-50/90 px-4 py-2.5 text-sm font-medium text-amber-950 shadow-sm transition enabled:hover:border-amber-800/40 enabled:hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:enabled:hover:bg-zinc-700"
        >
          ← Sessão anterior
        </button>
        <p className="text-center text-xs uppercase tracking-[0.2em] text-amber-900/70 dark:text-zinc-500">
          Sessão {index + 1} de {total}
        </p>
        <button
          type="button"
          onClick={goNext}
          disabled={atEnd}
          className="rounded-lg border border-amber-900/25 bg-amber-50/90 px-4 py-2.5 text-sm font-medium text-amber-950 shadow-sm transition enabled:hover:border-amber-800/40 enabled:hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:enabled:hover:bg-zinc-700"
        >
          Próxima sessão →
        </button>
      </nav>

      <p className="text-center text-[11px] text-amber-900/60 dark:text-zinc-500">
        Dica: use as setas ← → do teclado para virar a página.
      </p>

      <article
        className={[
          "relative mx-auto w-full max-w-none rounded-sm border shadow-[0_2px_0_0_rgba(120,83,40,0.12),0_12px_40px_-8px_rgba(0,0,0,0.25)]",
          "border-amber-200/80 bg-[#faf6ef] text-amber-950",
          "dark:border-zinc-700 dark:bg-[#1c1917] dark:text-zinc-200 dark:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)]",
          "before:pointer-events-none before:absolute before:inset-y-8 before:left-1/2 before:hidden before:w-px before:-translate-x-px before:bg-amber-900/10 md:before:block",
        ].join(" ")}
        aria-labelledby="session-book-title"
      >
        <div className="border-b border-amber-900/10 px-8 pb-4 pt-10 dark:border-zinc-600/50 sm:px-12 sm:pt-12">
          <h2
            id="session-book-title"
            className="text-center font-serif text-xl font-semibold tracking-tight sm:text-2xl"
          >
            {current.title}
          </h2>
          {current.date.trim() !== "" ? (
            <p className="mt-3 text-center font-serif text-sm italic text-amber-900/80 dark:text-zinc-400">
              {current.date}
            </p>
          ) : null}
        </div>
        <div className="space-y-5 px-8 py-10 text-[1.05rem] leading-[1.75] sm:px-12 sm:py-12 sm:text-[1.08rem] sm:leading-[1.8]">
          {current.paragraphs.map((p, i) => (
            <p key={i} className="text-justify indent-6 first:indent-0">
              <CampaignRichText text={p} variant="session" />
            </p>
          ))}
        </div>
      </article>

      <nav
        className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between"
        aria-label="Navegação entre sessões (rodapé)"
      >
        <button
          type="button"
          onClick={goPrev}
          disabled={atStart}
          className="rounded-lg border border-amber-900/25 bg-amber-50/90 px-4 py-2.5 text-sm font-medium text-amber-950 shadow-sm transition enabled:hover:border-amber-800/40 enabled:hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:enabled:hover:bg-zinc-700"
        >
          ← Sessão anterior
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={atEnd}
          className="rounded-lg border border-amber-900/25 bg-amber-50/90 px-4 py-2.5 text-sm font-medium text-amber-950 shadow-sm transition enabled:hover:border-amber-800/40 enabled:hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:enabled:hover:bg-zinc-700"
        >
          Próxima sessão →
        </button>
      </nav>
    </div>
  );
}
