import { AlternatingImageTextList } from "@/components/AlternatingImageTextList";
import { CampaignPageShell } from "@/components/CampaignPageShell";
import { CampaignRichText } from "@/components/CampaignRichText";
import { people } from "@/data/people";

export default function PessoasPage() {
  const items = people.map((p) => ({
    id: p.id,
    title: p.name,
    image: p.image,
    paragraphs: p.paragraphs,
  }));

  return (
    <CampaignPageShell title="Pessoas">
      <div className="space-y-12">
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          <CampaignRichText text="NPCs e figuras importantes. Clique no retrato para abrir o zoom." />
        </p>
        <AlternatingImageTextList items={items} entityBasePath="/pessoas" />
      </div>
    </CampaignPageShell>
  );
}
