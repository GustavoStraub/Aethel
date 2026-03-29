import { useMemo, useState } from "react";
import { AlternatingImageTextList } from "@/components/AlternatingImageTextList";
import { CampaignPageShell } from "@/components/CampaignPageShell";
import { CampaignRichText } from "@/components/CampaignRichText";
import { people } from "@/data/people";

function matchesPersonSearch(
  query: string,
  name: string,
  paragraphs: string[],
): boolean {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return true;
  if (name.toLowerCase().includes(q)) return true;
  return paragraphs.some((p) => p.toLowerCase().includes(q));
}

export default function PessoasPage() {
  const [search, setSearch] = useState("");

  const items = useMemo(() => {
    return people
      .filter((p) => matchesPersonSearch(search, p.name, p.paragraphs))
      .map((p) => ({
        id: p.id,
        title: p.name,
        image: p.image,
        paragraphs: p.paragraphs,
      }));
  }, [search]);

  const headerExtra = (
    <div className="flex flex-col gap-1">
      <label htmlFor="pessoas-busca" className="sr-only">
        Buscar pessoas
      </label>
      <input
        id="pessoas-busca"
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nome ou texto…"
        autoComplete="off"
        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-300 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
      />
    </div>
  );

  return (
    <CampaignPageShell title="Pessoas" headerExtra={headerExtra}>
      <div className="space-y-12">
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          <CampaignRichText text="NPCs e figuras importantes. Clique no retrato para abrir o zoom." />
        </p>
        {items.length === 0 ? (
          <p className="text-base text-zinc-600 dark:text-zinc-400">
            Nenhuma pessoa corresponde à busca.
          </p>
        ) : (
          <AlternatingImageTextList items={items} entityBasePath="/pessoas" />
        )}
      </div>
    </CampaignPageShell>
  );
}
