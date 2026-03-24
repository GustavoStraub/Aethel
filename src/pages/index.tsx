import { Geist } from "next/font/google";
import { CampaignLinkCards } from "@/components/CampaignLinkCards";
import { CampaignRichText } from "@/components/CampaignRichText";
import { CharactersHeader } from "@/components/CharactersHeader";
import { WorldMapZoomModal } from "@/components/WorldMapZoomModal";
import { characters } from "@/data/characters";
import { siteContentWidthClass } from "@/lib/siteLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={`${geistSans.className} flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50`}
    >
      <CharactersHeader characters={characters} />

      <main className="flex flex-1 flex-col">
        <section className="w-full shrink-0 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
          <div className={`${siteContentWidthClass} py-6`}>
            <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Mapa Mundial de Aethel
            </h2>
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10 lg:gap-12">
              <div className="w-full shrink-0 md:w-auto md:max-w-md lg:max-w-lg">
                <WorldMapZoomModal
                  src="/Maps/Aethel.png"
                  alt="Mapa do mundo de Aethel"
                  width={1920}
                  height={1080}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 360px, 512px"
                  priority
                />
              </div>
              <div className="min-w-0 flex-1 text-base leading-relaxed text-zinc-700 dark:text-zinc-300 [&_p+p]:mt-4">
                <p>
                  <CampaignRichText
                    text={
                      "Athel é um mundo de possibilidades infinitas. Das metrópoles flutuantes governadas por magos arcano-democráticos às profundezas esquecidas do Subterrâneo, onde Drows e Anões travam guerras milenares. É um lugar onde o rugido de um dragão antigo é tão comum quanto o som das harpas nas cortes das fadas, e onde o destino de reinos inteiros é decidido tanto no fio da espada quanto em contratos infernais."
                    }
                  />
                </p>
                <p>
                  <CampaignRichText
                    text={
                      "Aqui, o seu passado é a sua bússola. Seja você um herdeiro de uma linhagem caída, um mercenário em busca de redenção ou um estudioso de segredos proibidos, o mundo reage aos seus passos."
                    }
                  />
                </p>
                <p className="italic text-zinc-600 dark:text-zinc-400">
                  <CampaignRichText text="Contudo, sussurros sondam os continentes…" />
                </p>
                <p className="italic text-zinc-600 dark:text-zinc-400">
                  <CampaignRichText text="O destino de Athel está sendo escrito." />
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full shrink-0 border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
          <div className={`${siteContentWidthClass} py-8`}>
            <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Explorar
            </h2>
            <CampaignLinkCards />
          </div>
        </section>
      </main>
    </div>
  );
}
