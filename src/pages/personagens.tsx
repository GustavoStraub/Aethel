import { AlternatingImageTextList } from "@/components/AlternatingImageTextList";
import { CampaignPageShell } from "@/components/CampaignPageShell";
import { CampaignRichText } from "@/components/CampaignRichText";
import { characters } from "@/data/characters";

export default function PersonagensPage() {
  const items = characters.map((c) => ({
    id: c.id,
    title: c.name,
    image: c.image,
    paragraphs: c.paragraphs,
  }));

  return (
    <CampaignPageShell title="Personagens">
      <div className="space-y-12">
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          <CampaignRichText text="Os personagens jogáveis do grupo. Clique no retrato para ampliar com zoom." />
        </p>
        <AlternatingImageTextList items={items} entityBasePath="/personagens" />
      </div>
    </CampaignPageShell>
  );
}
