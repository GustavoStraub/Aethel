import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { Geist } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const MindMapViewer = dynamic(() => import("@/components/MindMapViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-zinc-500">
        <svg className="h-8 w-8 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-sm font-medium tracking-wide">Desenhando mapa mental...</span>
      </div>
    </div>
  ),
});

export default function MapaMentalPage() {
  return (
    <>
      <Head>
        <title>Mapa Mental | Aethel</title>
      </Head>
      <div className={`${geistSans.className} flex h-dvh flex-col overflow-hidden bg-zinc-950 font-sans text-zinc-50`}>
        <header className="shrink-0 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
          <div className="flex items-center gap-4 px-4 py-2.5 sm:px-6 sm:py-3.5">
            <div className="min-w-0">
              <Link
                href="/"
                className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-200"
              >
                ← Início
              </Link>
              <h1 className="mt-1 text-base font-semibold tracking-tight sm:text-xl">
                Mapa Mental
              </h1>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1">
          <MindMapViewer />
        </main>
      </div>
    </>
  );
}
