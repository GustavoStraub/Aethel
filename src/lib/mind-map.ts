import { characters } from "@/data/characters";
import { factions } from "@/data/factions";
import { locations } from "@/data/locations";
import { people } from "@/data/people";
import type { SessionEntry } from "@/data/sessions";
import { sessions } from "@/data/sessions";
import { escapeRegExp, getCampaignLinkRules } from "@/lib/campaign-links";

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

function buildMatcher(rules: { label: string; id: string }[]) {
  if (rules.length === 0) return null;
  const pattern = rules.map((r) => escapeRegExp(r.label)).join("|");
  return new RegExp(`(?<![\\p{L}])(${pattern})(?![\\p{L}])`, "giu");
}

function hrefToMindMapNodeId(href: string): string | null {
  const pairs: [prefix: string, kind: string][] = [
    ["/pessoas#", "person_"],
    ["/personagens#", "char_"],
    ["/locais#", "loc_"],
    ["/faccoes#", "faction_"],
  ];
  for (const [prefix, kind] of pairs) {
    if (href.startsWith(prefix)) {
      return `${kind}${href.slice(prefix.length)}`;
    }
  }
  return null;
}

/**
 * Etiquetas alinhadas a `CampaignRichText` (`getCampaignLinkRules`), mais títulos de
 * sessão (nós do grafo; não entram nas regras de link do site).
 */
function buildMindMapLinkRules(): { label: string; id: string }[] {
  const rules: { label: string; id: string }[] = [];
  for (const r of getCampaignLinkRules()) {
    const id = hrefToMindMapNodeId(r.href);
    if (id) rules.push({ label: r.label, id });
  }
  for (const s of sessions) {
    rules.push({ label: s.title, id: `session_${s.id}` });
  }
  rules.sort((a, b) => b.label.length - a.label.length);
  return rules;
}

/** Todo o texto onde a UI aplica links automáticos na sessão (parágrafos + tabelas). */
function sessionTextsForLinks(s: SessionEntry): string[] {
  const chunks: string[] = [...s.paragraphs];
  for (const t of s.inlineTables ?? []) {
    chunks.push(...t.headers);
    for (const row of t.rows) {
      chunks.push(...row);
    }
  }
  return chunks;
}

export function generateMindMapData(): MindMapGraphData {
  const nodes: MindMapNode[] = [];
  const edges: MindMapEdge[] = [];

  for (const c of characters) {
    nodes.push({
      id: `char_${c.id}`,
      name: c.name,
      group: "Personagem",
      val: 1.5,
      image: c.image.src,
      href: `/personagens#${c.id}`,
    });
  }

  for (const p of people) {
    nodes.push({
      id: `person_${p.id}`,
      name: p.name,
      group: "Pessoa",
      val: 1.2,
      image: p.image.src,
      href: `/pessoas#${p.id}`,
    });
  }

  for (const f of factions) {
    nodes.push({
      id: `faction_${f.id}`,
      name: f.title,
      group: "Facção",
      val: 1.4,
      image: f.image.src,
      href: `/faccoes#${f.id}`,
    });
  }

  for (const l of locations) {
    nodes.push({
      id: `loc_${l.id}`,
      name: l.title,
      group: "Local",
      val: 1.4,
      image: l.image.src,
      href: `/locais#${l.id}`,
    });
  }

  for (const s of sessions) {
    nodes.push({
      id: `session_${s.id}`,
      name: s.title,
      group: "Sessão",
      val: 1.1,
      href: `/sessoes?sessao=${encodeURIComponent(s.id)}`,
    });
  }

  const linkRules = buildMindMapLinkRules();
  const matcher = buildMatcher(linkRules);
  const edgeSet = new Set<string>();

  const processEntityDesc = (originId: string, textChunks: string[]) => {
    if (!matcher) return;
    const fullText = textChunks.join("\n");
    for (const match of fullText.matchAll(matcher)) {
      const matchedStr = match[1];
      const rule = linkRules.find(
        (r) => r.label.toLowerCase() === matchedStr.toLowerCase(),
      );
      if (rule && rule.id !== originId) {
        const edgeKey = `${originId}->${rule.id}`;
        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey);
          edges.push({ source: originId, target: rule.id });
        }
      }
    }
  };

  for (const c of characters) {
    processEntityDesc(`char_${c.id}`, [c.name, ...c.paragraphs]);
  }
  for (const p of people) {
    processEntityDesc(`person_${p.id}`, [p.name, ...p.paragraphs]);
  }
  for (const f of factions) {
    processEntityDesc(`faction_${f.id}`, [f.title, ...f.paragraphs]);
  }
  for (const l of locations) {
    processEntityDesc(`loc_${l.id}`, [l.title, ...l.paragraphs]);
  }
  for (const s of sessions) {
    processEntityDesc(`session_${s.id}`, sessionTextsForLinks(s));
  }

  return { nodes, links: edges };
}
