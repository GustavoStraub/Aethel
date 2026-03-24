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
        <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
          <div className={`${siteContentWidthClass} py-6`}>
            <Link
              href="/"
              className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              ← Início
            </Link>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </h1>
          </div>
        </header>
        <main className={`${siteContentWidthClass} py-8`}>{children}</main>
      </div>
    </>
  );
}
