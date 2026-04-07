import dynamic from "next/dynamic";
import { CampaignPageShell } from "@/components/CampaignPageShell";

// O renderizador do Grafo usa funções de Canvas e dependências do D3/ForceGraph
// que requerem document/window e por isso não podem renderizar no servidor (SSR).
const MindMapViewer = dynamic(() => import("@/components/MindMapViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[75vh] w-full items-center justify-center rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur">
      <div className="flex flex-col items-center gap-4 text-zinc-500">
        <svg className="h-8 w-8 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm font-medium tracking-wide">Desenhando mapa mental...</span>
      </div>
    </div>
  ),
});

export default function MapaMentalPage() {
  return (
    <CampaignPageShell title="Mapa Mental">
      <div className="mb-8 max-w-2xl text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
        <p>
          Esta é a representação visual interconectada de tudo o que sabemos em Aethel.
          Cada conexão reflete como personagens, facções e locais se entrelaçam na história.
        </p>
      </div>

      <MindMapViewer />
    </CampaignPageShell>
  );
}
