import Head from "next/head";
import Link from "next/link";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import { siteContentWidthClass } from "@/lib/siteLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

type CampaignPageShellProps = {
  title: string;
  children: ReactNode;
};

export function CampaignPageShell({ title, children }: CampaignPageShellProps) {
  return (
    <>
      <Head>
        <title>{title} | Aethel</title>
      </Head>
      <div
        className={`${geistSans.className} min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50`}
      >
        <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
          <div className={`${siteContentWidthClass} py-3 sm:py-3.5`}>
            <Link
              href="/"
              className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              ← Início
            </Link>
            <h1 className="mt-1.5 text-lg font-semibold tracking-tight sm:text-xl">
              {title}
            </h1>
          </div>
        </header>
        <main className={`${siteContentWidthClass} py-6 sm:py-7`}>
          {children}
        </main>
      </div>
    </>
  );
}
