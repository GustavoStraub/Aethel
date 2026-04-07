import { characters } from "@/data/characters";
import { factions } from "@/data/factions";
import { locations } from "@/data/locations";
import { people } from "@/data/people";
import { sessions, type SessionInlineTable } from "@/data/sessions";
import type { MindMapGroup, MindMapNode } from "@/lib/mind-map";

export type MindMapNodeDetail = {
  title: string;
  group: MindMapGroup;
  paragraphs: string[];
  pageHref: string;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    sizes?: string;
  };
  /** Sessão: data no mundo; gravação opcional. */
  subtitle?: string;
  recordingUrl?: string;
  /** Sessão: tabelas após parágrafos (como no livro de sessões). */
  inlineTables?: SessionInlineTable[];
};

export function getMindMapNodeDetail(node: MindMapNode): MindMapNodeDetail {
  const pageHref = node.href;

  if (node.id.startsWith("char_")) {
    const raw = node.id.slice("char_".length);
    const c = characters.find((x) => x.id === raw);
    if (c) {
      return {
        title: c.name,
        group: "Personagem",
        paragraphs: c.paragraphs,
        pageHref,
        image: c.image,
      };
    }
  }

  if (node.id.startsWith("person_")) {
    const raw = node.id.slice("person_".length);
    const p = people.find((x) => x.id === raw);
    if (p) {
      return {
        title: p.name,
        group: "Pessoa",
        paragraphs: p.paragraphs,
        pageHref,
        image: p.image,
      };
    }
  }

  if (node.id.startsWith("faction_")) {
    const raw = node.id.slice("faction_".length);
    const f = factions.find((x) => x.id === raw);
    if (f) {
      return {
        title: f.title,
        group: "Facção",
        paragraphs: f.paragraphs,
        pageHref,
        image: f.image,
      };
    }
  }

  if (node.id.startsWith("loc_")) {
    const raw = node.id.slice("loc_".length);
    const l = locations.find((x) => x.id === raw);
    if (l) {
      return {
        title: l.title,
        group: "Local",
        paragraphs: l.paragraphs,
        pageHref,
        image: l.image,
      };
    }
  }

  if (node.id.startsWith("session_")) {
    const raw = node.id.slice("session_".length);
    const s = sessions.find((x) => x.id === raw);
    if (s) {
      return {
        title: s.title,
        group: "Sessão",
        paragraphs: s.paragraphs,
        pageHref,
        subtitle: s.date,
        recordingUrl: s.recordingUrl,
        inlineTables: s.inlineTables,
      };
    }
  }

  return {
    title: node.name,
    group: node.group,
    paragraphs: [],
    pageHref,
  };
}
