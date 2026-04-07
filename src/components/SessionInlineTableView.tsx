"use client";

import { CampaignRichText } from "@/components/CampaignRichText";
import type { SessionInlineTable } from "@/data/sessions";

export function SessionInlineTableView({
  table,
}: {
  table: SessionInlineTable;
}) {
  const { headers, rows } = table;
  return (
    <div
      className="my-2 overflow-x-auto rounded-md border border-amber-900/15 bg-amber-50/50 dark:border-zinc-600 dark:bg-zinc-900/50"
      role="region"
      aria-label="Tabela de presos"
    >
      <table className="w-full min-w-[min(100%,22rem)] border-collapse text-left text-[0.92rem] leading-snug sm:text-[0.95rem]">
        <thead>
          <tr className="border-b border-amber-900/20 bg-amber-100/70 dark:border-zinc-600 dark:bg-zinc-800/90">
            {headers.map((h, j) => (
              <th
                key={j}
                scope="col"
                className="px-3 py-2.5 font-semibold text-amber-950 dark:text-zinc-100"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-amber-900/10 last:border-b-0 dark:border-zinc-700"
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-3 py-2 align-top text-amber-950/95 dark:text-zinc-300"
                >
                  <CampaignRichText text={cell} variant="session" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
