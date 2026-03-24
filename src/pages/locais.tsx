import { AlternatingImageTextList } from "@/components/AlternatingImageTextList";
import { CampaignPageShell } from "@/components/CampaignPageShell";
import { CampaignRichText } from "@/components/CampaignRichText";
import { locations } from "@/data/locations";

export default function LocaisPage() {
  const items = locations.map((loc) => ({
    id: loc.id,
    title: loc.title,
    image: loc.image,
    paragraphs: loc.paragraphs,
  }));

  return (
    <CampaignPageShell title="Locais">
      <div className="space-y-12">
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          <CampaignRichText text="Cidades e regiões do mundo de Aethel. Clique no mapa para ampliar com zoom." />
        </p>
        <AlternatingImageTextList items={items} entityBasePath="/locais" />
      </div>
    </CampaignPageShell>
  );
}
