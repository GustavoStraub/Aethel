"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo } from "react";
import {
  escapeRegExp,
  getCampaignLinkRules,
  type CampaignLinkRule,
} from "@/lib/campaign-links";

type CampaignRichTextProps = {
  text: string;
  /** `session`: estilo âmbar do livro de sessões; `default`: resto do site. */
  variant?: "session" | "default";
  /**
   * Se o texto corresponder a uma regra com este `href`, não cria link
   * (evita auto-referência na mesma ficha, ex. "Conselho Mercantil" na página da facção).
   */
  selfHref?: string;
};

const linkClassName: Record<
  NonNullable<CampaignRichTextProps["variant"]>,
  string
> = {
  session:
    "font-medium text-amber-900 underline decoration-amber-800/45 underline-offset-[3px] transition hover:decoration-amber-800 dark:text-amber-200/95 dark:decoration-amber-400/45 dark:hover:decoration-amber-300",
  default:
    "font-medium text-zinc-800 underline decoration-zinc-400/50 underline-offset-[3px] transition hover:decoration-zinc-600 dark:text-sky-200/90 dark:decoration-sky-500/40 dark:hover:decoration-sky-300",
};

function buildMatcher(rules: CampaignLinkRule[]) {
  if (rules.length === 0) return null;
  const pattern = rules.map((r) => escapeRegExp(r.label)).join("|");
  return new RegExp(`(?<![\\p{L}])(${pattern})(?![\\p{L}])`, "giu");
}

function linkifyToNodes(
  text: string,
  rules: CampaignLinkRule[],
  variant: NonNullable<CampaignRichTextProps["variant"]>,
  selfHref: string | undefined,
): ReactNode {
  const re = buildMatcher(rules);
  if (!re) return text;

  const sorted = [...rules].sort((a, b) => b.label.length - a.label.length);
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  const className = linkClassName[variant];

  for (const m of text.matchAll(re)) {
    const idx = m.index ?? 0;
    const matched = m[1];
    if (idx > last) {
      nodes.push(<span key={key++}>{text.slice(last, idx)}</span>);
    }
    const rule = sorted.find(
      (r) => r.label.toLowerCase() === matched.toLowerCase(),
    );
    const href = rule?.href ?? "#";
    const isSelf =
      selfHref !== undefined && rule !== undefined && href === selfHref;
    if (isSelf) {
      nodes.push(<span key={key++}>{matched}</span>);
    } else {
      nodes.push(
        <Link key={key++} href={href} className={className}>
          {matched}
        </Link>,
      );
    }
    last = idx + matched.length;
  }
  if (last < text.length) {
    nodes.push(<span key={key++}>{text.slice(last)}</span>);
  }
  return nodes.length > 0 ? <>{nodes}</> : text;
}

export function CampaignRichText({
  text,
  variant = "default",
  selfHref,
}: CampaignRichTextProps) {
  const rules = useMemo(() => getCampaignLinkRules(), []);
  const content = useMemo(
    () => linkifyToNodes(text, rules, variant, selfHref),
    [text, rules, variant, selfHref],
  );
  return <>{content}</>;
}
