import { AlternatingImageTextList } from "@/components/AlternatingImageTextList";
import { CampaignPageShell } from "@/components/CampaignPageShell";
import { CampaignRichText } from "@/components/CampaignRichText";
import { factions } from "@/data/factions";

export default function FaccoesPage() {
  const items = factions.map((f) => ({
    id: f.id,
    title: f.title,
    image: f.image,
    paragraphs: f.paragraphs,
  }));

  return (
    <CampaignPageShell title="Facções">
      <div className="space-y-12">
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          <CampaignRichText text="Organizações, guildas e grupos de poder; clique para ampliar com zoom." />
        </p>
        <AlternatingImageTextList items={items} entityBasePath="/faccoes" />
      </div>
    </CampaignPageShell>
  );
}
