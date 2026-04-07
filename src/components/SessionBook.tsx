"use client";

import { Literata } from "next/font/google";
import { useRouter } from "next/router";
import { Fragment, useCallback, useEffect, useMemo } from "react";
import { CampaignRichText } from "@/components/CampaignRichText";
import { SessionInlineTableView } from "@/components/SessionInlineTableView";
import type { SessionEntry } from "@/data/sessions";

const literata = Literata({
  subsets: ["latin"],
  variable: "--font-literata",
});

const SESSAO_QUERY_KEY = "sessao";

function parseSessaoQuery(q: string | string[] | undefined): number | null {
  const raw = Array.isArray(q) ? q[0] : q;
  if (raw == null || raw === "") return null;
  const n = parseInt(String(raw), 10);
  if (!Number.isFinite(n) || n < 1) return null;
  return n - 1;
}

type SessionBookProps = {
  sessions: SessionEntry[];
};

export function SessionBook({ sessions: pages }: SessionBookProps) {
  const router = useRouter();
  const total = pages.length;

  const sessaoRaw = router.query[SESSAO_QUERY_KEY];

  const lastIndex = total > 0 ? total - 1 : 0;

  const activeIndex = useMemo(() => {
    if (total <= 0) return 0;
    if (!router.isReady) return lastIndex;
    const p = parseSessaoQuery(sessaoRaw);
    if (p === null) return lastIndex;
    return Math.min(Math.max(0, p), lastIndex);
  }, [router.isReady, sessaoRaw, total, lastIndex]);

  const current = total > 0 ? pages[activeIndex] : undefined;

  const setSessionIndex = useCallback(
    (nextIndex: number) => {
      if (!router.isReady || total <= 0) return;
      const clamped = Math.min(Math.max(0, nextIndex), total - 1);
      void router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, [SESSAO_QUERY_KEY]: String(clamped + 1) },
        },
        undefined,
        { shallow: true, scroll: false },
      );
    },
    [router, total],
  );

  useEffect(() => {
    if (!router.isReady || total <= 0) return;

    const p = parseSessaoQuery(sessaoRaw);
    if (p === null) {
      void router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, [SESSAO_QUERY_KEY]: String(total) },
        },
        undefined,
        { shallow: true, scroll: false },
      );
      return;
    }

    if (p > total - 1) {
      void router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, [SESSAO_QUERY_KEY]: String(total) },
        },
        undefined,
        { shallow: true, scroll: false },
      );
    }
  }, [router, router.isReady, total, router.pathname, sessaoRaw, router.query]);

  useEffect(() => {
    if (total <= 0 || !router.isReady) return;
    const max = total - 1;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target;
      if (t instanceof HTMLElement) {
        const tag = t.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || t.isContentEditable) {
          return;
        }
      }
      const raw = router.query[SESSAO_QUERY_KEY];
      let idx = parseSessaoQuery(raw);
      if (idx === null) idx = max;
      idx = Math.min(Math.max(0, idx), max);
      if (e.key === "ArrowLeft") setSessionIndex(idx - 1);
      if (e.key === "ArrowRight") setSessionIndex(idx + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total, router.isReady, router.query, setSessionIndex]);

  if (total === 0 || !current) {
    return (
      <p className="text-zinc-600 dark:text-zinc-400">
        Nenhuma sessão registrada ainda.
      </p>
    );
  }

  const atStart = activeIndex === 0;
  const atEnd = activeIndex === total - 1;

  const navBtnClass =
    "inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-amber-900/25 bg-amber-50/90 text-sm font-medium text-amber-950 shadow-sm transition enabled:hover:border-amber-800/40 enabled:hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:enabled:hover:bg-zinc-700";

  const badgeClass = (selected: boolean) =>
    [
      "inline-flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold tabular-nums shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 dark:focus-visible:outline-amber-400",
      selected
        ? "border-amber-800/55 bg-amber-200/95 text-amber-950 ring-2 ring-amber-700/30 dark:border-amber-400/45 dark:bg-amber-900/55 dark:text-amber-100 dark:ring-amber-400/20"
        : "border-amber-900/20 bg-amber-50/80 text-amber-900 hover:border-amber-800/40 hover:bg-amber-100 dark:border-zinc-600 dark:bg-zinc-800/90 dark:text-zinc-200 dark:hover:bg-zinc-700",
    ].join(" ");

  return (
    <div className={`${literata.className} relative isolate`}>
      <article
        className={[
          "relative z-0 mx-auto w-full max-w-none rounded-sm border shadow-[0_2px_0_0_rgba(120,83,40,0.12),0_12px_40px_-8px_rgba(0,0,0,0.25)]",
          "border-amber-200/80 bg-[#faf6ef] text-amber-950",
          "dark:border-zinc-700 dark:bg-[#1c1917] dark:text-zinc-200 dark:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)]",
          "before:pointer-events-none before:absolute before:inset-y-8 before:left-1/2 before:hidden before:w-px before:-translate-x-px before:bg-amber-900/10 md:before:block",
        ].join(" ")}
        aria-labelledby="session-book-title"
      >
        <div className="border-b border-amber-900/10 px-6 pb-5 pt-8 dark:border-zinc-600/50 sm:px-10 sm:pb-6 sm:pt-10 md:px-12">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_auto_1fr] md:items-start md:gap-4">
            <div className="min-w-0 text-center md:col-start-2 md:row-start-1 md:px-2">
              <h2
                id="session-book-title"
                className="font-serif text-xl font-semibold tracking-tight sm:text-2xl"
              >
                {current.title}
              </h2>
              {current.date.trim() !== "" ? (
                <p className="mt-2.5 font-serif text-sm italic text-amber-900/80 dark:text-zinc-400">
                  {current.date}
                </p>
              ) : null}
              {current.recordingUrl ? (
                <p
                  className={
                    current.date.trim() !== ""
                      ? "mt-2 text-center text-sm"
                      : "mt-2.5 text-center text-sm"
                  }
                >
                  <a
                    href={current.recordingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-amber-900 underline decoration-amber-800/45 underline-offset-[3px] transition hover:decoration-amber-800 dark:text-amber-200/95 dark:decoration-amber-400/45 dark:hover:decoration-amber-300"
                  >
                    Link para ouvir a sessão gravada
                  </a>
                </p>
              ) : null}
            </div>

            <div
              className="flex flex-wrap items-center justify-center gap-1.5 md:col-start-1 md:row-start-1 md:justify-start"
              role="tablist"
              aria-label="Sessões"
            >
              <button
                type="button"
                aria-label="Sessão anterior"
                disabled={atStart}
                onClick={() => setSessionIndex(activeIndex - 1)}
                className={navBtnClass}
              >
                ‹
              </button>
              {pages.map((s, i) => {
                const n = i + 1;
                const selected = i === activeIndex;
                const sub = s.date.trim();
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-label={sub ? `${s.title}, ${sub}` : s.title}
                    onClick={() => setSessionIndex(i)}
                    className={badgeClass(selected)}
                  >
                    {n}
                  </button>
                );
              })}
              <button
                type="button"
                aria-label="Próxima sessão"
                disabled={atEnd}
                onClick={() => setSessionIndex(activeIndex + 1)}
                className={navBtnClass}
              >
                ›
              </button>
            </div>

            <div
              className="hidden md:col-start-3 md:row-start-1 md:block"
              aria-hidden
            />
          </div>
        </div>
        <div className="space-y-5 px-8 py-10 text-[1.05rem] leading-[1.75] sm:px-12 sm:py-12 sm:text-[1.08rem] sm:leading-[1.8]">
          {current.paragraphs.map((p, i) => (
            <Fragment key={i}>
              <p className="text-justify indent-6 first:indent-0">
                <CampaignRichText text={p} variant="session" />
              </p>
              {current.inlineTables
                ?.filter((t) => t.afterParagraphIndex === i)
                .map((t, ti) => (
                  <SessionInlineTableView key={`${i}-table-${ti}`} table={t} />
                ))}
            </Fragment>
          ))}
        </div>
      </article>
    </div>
  );
}
