import Link from "next/link";

const items = [
  {
    href: "/sessoes",
    title: "Sessões",
    description:
      "Anotações de cada sessão de jogo: recapitulações, ganchos e o que descobriram.",
  },
  {
    href: "/personagens",
    title: "Personagens",
    description:
      "Os aventureiros do grupo: retratos e histórias dos personagens jogáveis.",
  },
  {
    href: "/pessoas",
    title: "Pessoas",
    description:
      "NPCs importantes, aliados, rivais e figuras que cruzam o caminho do grupo.",
  },
  {
    href: "/faccoes",
    title: "Facções",
    description:
      "Organizações, guildas, reinos e grupos — o que sabem e o que ainda é mistério.",
  },
  {
    href: "/locais",
    title: "Locais",
    description:
      "Cidades, masmorras, regiões e pontos de interesse no mapa e na história.",
  },
] as const;

export function CampaignLinkCards() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="group flex h-full flex-col rounded-xl border border-zinc-200 bg-white/60 p-5 shadow-sm transition hover:border-zinc-300 hover:bg-white hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
          >
            <span className="text-base font-semibold text-zinc-900 group-hover:text-zinc-950 dark:text-zinc-50 dark:group-hover:text-white">
              {item.title}
            </span>
            <span className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {item.description}
            </span>
            <span className="mt-4 text-sm font-medium text-zinc-500 group-hover:text-zinc-800 dark:text-zinc-500 dark:group-hover:text-zinc-300">
              Abrir →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
