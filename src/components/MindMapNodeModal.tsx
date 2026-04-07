"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useMemo } from "react";
import { CampaignRichText } from "@/components/CampaignRichText";
import { SessionInlineTableView } from "@/components/SessionInlineTableView";
import { getMindMapNodeDetail } from "@/lib/mind-map-node-detail";
import type { MindMapNode } from "@/lib/mind-map";

const GROUP_BADGE: Record<string, string> = {
  Personagem: "bg-red-500/20 text-red-200 ring-red-500/30",
  Pessoa: "bg-blue-500/20 text-blue-200 ring-blue-500/30",
  Facção: "bg-amber-500/20 text-amber-200 ring-amber-500/30",
  Local: "bg-emerald-500/20 text-emerald-200 ring-emerald-500/30",
  Sessão: "bg-violet-500/20 text-violet-200 ring-violet-500/30",
};

type MindMapNodeModalProps = {
  node: MindMapNode | null;
  onClose: () => void;
};

export function MindMapNodeModal({ node, onClose }: MindMapNodeModalProps) {
  const detail = useMemo(
    () => (node ? getMindMapNodeDetail(node) : null),
    [node],
  );

  useEffect(() => {
    if (!node) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [node, onClose]);

  if (!node || !detail) return null;

  const badgeClass =
    GROUP_BADGE[detail.group] ??
    "bg-zinc-500/20 text-zinc-200 ring-zinc-500/30";

  return (
    <div
      role="dialog"
      aria-modal
      aria-labelledby="mind-map-modal-title"
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
      }}
    >
      <button
        type="button"
        aria-label="Fechar"
        className="absolute inset-0 cursor-pointer bg-black/65 backdrop-blur-[2px] transition hover:bg-black/70"
        onClick={onClose}
      />
      <div
        className="relative z-[1] flex max-h-[min(88vh,900px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-violet-500/30 bg-zinc-950 shadow-[0_0_0_1px_rgba(139,92,246,0.15),0_25px_80px_rgba(0,0,0,0.65)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-zinc-800/80 px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            <p
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ring-1 ${badgeClass}`}
            >
              {detail.group}
            </p>
            <h2
              id="mind-map-modal-title"
              className="mt-2 text-xl font-semibold leading-tight text-zinc-50 sm:text-2xl"
            >
              {detail.title}
            </h2>
            {detail.subtitle ? (
              <p className="mt-1.5 text-sm italic text-zinc-400">
                {detail.subtitle}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 min-h-[44px] min-w-[44px] shrink-0 cursor-pointer items-center justify-center rounded-lg border border-zinc-600/80 bg-zinc-900/80 text-xl leading-none text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-800 hover:text-white"
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
          {detail.image ? (
            <div className="relative mx-auto mb-5 aspect-[3/4] w-full max-w-xs overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-900 sm:max-w-sm">
              <Image
                src={detail.image.src}
                alt={detail.image.alt}
                fill
                sizes={detail.image.sizes ?? "(max-width: 640px) 90vw, 24rem"}
                className="object-cover"
                priority={false}
              />
            </div>
          ) : null}

          {detail.recordingUrl ? (
            <p className="mb-4 text-sm">
              <a
                href={detail.recordingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-violet-300 underline decoration-violet-500/50 underline-offset-2 transition hover:text-violet-200 hover:decoration-violet-400"
              >
                Ouvir gravação da sessão
              </a>
            </p>
          ) : null}

          {detail.paragraphs.length === 0 ? (
            <p className="text-sm text-zinc-400">
              Abra a página da campanha para ver o texto completo desta ficha.
            </p>
          ) : (
            <div className="space-y-4 text-base leading-relaxed text-zinc-200">
              {detail.paragraphs.map((p, i) => (
                <Fragment key={i}>
                  <p>
                    <CampaignRichText
                      text={p}
                      variant={
                        detail.group === "Sessão" ? "session" : "default"
                      }
                      selfHref={detail.pageHref}
                    />
                  </p>
                  {detail.inlineTables
                    ?.filter((t) => t.afterParagraphIndex === i)
                    .map((t, ti) => (
                      <SessionInlineTableView
                        key={`${i}-table-${ti}`}
                        table={t}
                      />
                    ))}
                </Fragment>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-zinc-800/80 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-lg border border-zinc-600 bg-transparent px-4 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            Fechar
          </button>
          <Link
            href={detail.pageHref}
            className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-lg border border-violet-500/50 bg-violet-600/25 px-4 text-sm font-semibold text-violet-100 shadow-sm transition hover:border-violet-400/60 hover:bg-violet-600/40"
          >
            Abrir página completa
          </Link>
        </div>
      </div>
    </div>
  );
}
