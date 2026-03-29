import Head from "next/head";
import Link from "next/link";
import type { ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { Geist } from "next/font/google";
import { siteContentWidthClass } from "@/lib/siteLayout";

const SCROLL_DELTA_MIN = 8;
const TOP_REVEAL_PX = 12;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

type CampaignPageShellProps = {
  title: string;
  /** Conteúdo opcional à direita do título no header (ex. campo de busca). */
  headerExtra?: ReactNode;
  children: ReactNode;
};

export function CampaignPageShell({
  title,
  headerExtra,
  children,
}: CampaignPageShellProps) {
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [headerHidden, setHeaderHidden] = useState(false);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const update = () => setHeaderHeight(el.offsetHeight);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    lastScrollY.current = window.scrollY;
  }, []);

  useLayoutEffect(() => {
    const onScroll = () => {
      const y = Math.max(0, window.scrollY);
      const delta = y - lastScrollY.current;

      if (y <= TOP_REVEAL_PX) {
        setHeaderHidden(false);
        lastScrollY.current = y;
        return;
      }

      if (Math.abs(delta) < SCROLL_DELTA_MIN) return;

      if (delta > 0) setHeaderHidden(true);
      else setHeaderHidden(false);

      lastScrollY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Head>
        <title>{title} | Aethel</title>
      </Head>
      <div
        className={`${geistSans.className} min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50`}
      >
        <div
          className="min-h-17 shrink-0 sm:min-h-18"
          style={headerHeight > 0 ? { height: headerHeight } : undefined}
          aria-hidden
        />
        <header
          ref={headerRef}
          className={
            "fixed top-0 right-0 left-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-md transition-transform duration-300 ease-out will-change-transform dark:border-zinc-800 dark:bg-zinc-950/90 " +
            (headerHidden ? "-translate-y-full" : "translate-y-0")
          }
        >
          <div
            className={`${siteContentWidthClass} flex flex-col gap-2 py-2.5 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:py-3.5`}
          >
            <div className="min-w-0 shrink-0">
              <Link
                href="/"
                className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                ← Início
              </Link>
              <h1 className="mt-1 text-base font-semibold tracking-tight sm:mt-1.5 sm:text-xl">
                {title}
              </h1>
            </div>
            {headerExtra != null ? (
              <div className="w-full min-w-0 sm:max-w-xs sm:shrink-0">
                {headerExtra}
              </div>
            ) : null}
          </div>
        </header>
        <main className={`${siteContentWidthClass} py-6 sm:py-7`}>
          {children}
        </main>
      </div>
    </>
  );
}
