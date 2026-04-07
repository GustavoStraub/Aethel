import { characters } from "@/data/characters";
import { factions } from "@/data/factions";
import { locations } from "@/data/locations";
import { people } from "@/data/people";
import { sessions } from "@/data/sessions";
import { escapeRegExp } from "@/lib/campaign-links";

export type MindMapGroup = "Personagem" | "Pessoa" | "Facção" | "Local" | "Sessão";

export type MindMapNode = {
  id: string; // The literal id from data + prefix to make it unique across categories or just literal id if we ensure no collisions. We'll use prefix just in caso.
  name: string;
  group: MindMapGroup;
  val: number; // size relative
  image?: string;
  href: string; // so clicking can redirect
};

export type MindMapEdge = {
  source: string; // Must match node id
  target: string; // Must match node id
};

export type MindMapGraphData = {
  nodes: MindMapNode[];
  links: MindMapEdge[];
};

function buildMatcher(rules: { label: string; id: string; }[]) {
  if (rules.length === 0) return null;
  const pattern = rules.map((r) => escapeRegExp(r.label)).join("|");
  return new RegExp(`(?<![\\p{L}])(${pattern})(?![\\p{L}])`, "giu");
}

export function generateMindMapData(): MindMapGraphData {
  const nodes: MindMapNode[] = [];
  const edges: MindMapEdge[] = [];

  // Generate lookup for all link rules specifically for the graph
  const rules: { label: string; id: string }[] = [];

  for (const c of characters) {
    rules.push({ label: c.name, id: `char_${c.id}` });
    nodes.push({ id: `char_${c.id}`, name: c.name, group: "Personagem", val: 1.5, image: c.image.src, href: `/personagens#${c.id}` });
  }

  for (const p of people) {
    rules.push({ label: p.name, id: `person_${p.id}` });
    nodes.push({ id: `person_${p.id}`, name: p.name, group: "Pessoa", val: 1.2, image: p.image.src, href: `/pessoas#${p.id}` });
  }

  for (const f of factions) {
    rules.push({ label: f.title, id: `faction_${f.id}` });
    nodes.push({ id: `faction_${f.id}`, name: f.title, group: "Facção", val: 1.4, image: f.image.src, href: `/faccoes#${f.id}` });
  }

  for (const l of locations) {
    rules.push({ label: l.title, id: `loc_${l.id}` });
    nodes.push({ id: `loc_${l.id}`, name: l.title, group: "Local", val: 1.4, image: l.image.src, href: `/locais#${l.id}` });
  }

  for (const s of sessions) {
    // Sessions don't have a label match rule usually (they aren't linked by name often), but let's add them
    rules.push({ label: s.title, id: `session_${s.id}` });
    // SessionBook abre a sessão via query `?sessao=` (1-based), não via âncora #.
    nodes.push({
      id: `session_${s.id}`,
      name: s.title,
      group: "Sessão",
      val: 1.1,
      href: `/sessoes?sessao=${encodeURIComponent(s.id)}`,
    });
  }

  // Sort matchers by length like campaign-links does
  rules.sort((a, b) => b.label.length - a.label.length);
  const matcher = buildMatcher(rules);

  // We will keep track of used edges to avoid duplicate A->B and B->A maybe?
  // Let's do directed so we can see who mentions who, but we'll use Set to avoid exact identical edges
  const edgeSet = new Set<string>();

  const processEntityDesc = (originId: string, paragraphs: string[]) => {
    if (!matcher) return;
    const fullText = paragraphs.join("\n");
    for (const match of fullText.matchAll(matcher)) {
      const matchedStr = match[1];
      const rule = rules.find((r) => r.label.toLowerCase() === matchedStr.toLowerCase());
      if (rule && rule.id !== originId) {
        const edgeKey = `${originId}->${rule.id}`;
        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey);
          edges.push({ source: originId, target: rule.id });
        }
      }
    }
  };

  for (const c of characters) processEntityDesc(`char_${c.id}`, c.paragraphs);
  for (const p of people) processEntityDesc(`person_${p.id}`, p.paragraphs);
  for (const f of factions) processEntityDesc(`faction_${f.id}`, f.paragraphs);
  for (const l of locations) processEntityDesc(`loc_${l.id}`, l.paragraphs);
  for (const s of sessions) processEntityDesc(`session_${s.id}`, s.paragraphs);

  return { nodes, links: edges };
}
