import { factions } from "@/data/factions";
import { locations } from "@/data/locations";
import { people } from "@/data/people";

export type CampaignLinkRule = {
  label: string;
  href: string;
};

/** Aliases e grafias alternativas (o título canónico já vem dos dados). */
const EXTRA_RULES: CampaignLinkRule[] = [
  { label: "Khenz", href: "/locais#khenza" },
];

let cached: CampaignLinkRule[] | null = null;

export function getCampaignLinkRules(): CampaignLinkRule[] {
  if (cached) return cached;
  const rules: CampaignLinkRule[] = [...EXTRA_RULES];

  for (const p of people) {
    rules.push({ label: p.name, href: `/pessoas#${p.id}` });
  }
  for (const l of locations) {
    rules.push({ label: l.title, href: `/locais#${l.id}` });
  }
  for (const f of factions) {
    rules.push({ label: f.title, href: `/faccoes#${f.id}` });
  }

  // Mais longo primeiro para frases como "Conselho Mercantil" antes de substrings
  rules.sort((a, b) => b.label.length - a.label.length);
  cached = rules;
  return rules;
}

export function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
