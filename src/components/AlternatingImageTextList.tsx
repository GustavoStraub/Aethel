import { CampaignRichText } from "@/components/CampaignRichText";
import { WorldMapZoomModal } from "@/components/WorldMapZoomModal";

export type AlternatingZoomableImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
};

export type AlternatingImageTextItem = {
  id: string;
  title: string;
  image: AlternatingZoomableImage;
  paragraphs: string[];
};

type EntityListBasePath = "/pessoas" | "/locais" | "/faccoes";

type AlternatingImageTextListProps = {
  items: AlternatingImageTextItem[];
  /** Usado para não linkar o título da própria ficha (ex. facção → ela mesma). */
  entityBasePath?: EntityListBasePath;
};

/**
 * Mesmo layout da página Pessoas: em telas médias/grandes, linhas alternadas —
 * índice par: imagem à esquerda; ímpar: imagem à direita. Clique na imagem abre o zoom.
 */
export function AlternatingImageTextList({
  items,
  entityBasePath,
}: AlternatingImageTextListProps) {
  return (
    <div className="space-y-16 sm:space-y-20">
      {items.map((item, index) => {
        const selfHref =
          entityBasePath !== undefined
            ? `${entityBasePath}#${item.id}`
            : undefined;
        return (
          <article
            id={item.id}
            key={item.id}
            className={`scroll-mt-24 flex flex-col gap-8 md:flex-row md:items-stretch md:gap-10 lg:gap-14 ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
          >
            <div className="w-full shrink-0 md:w-1/2 md:max-w-xl">
              <WorldMapZoomModal
                src={item.image.src}
                alt={item.image.alt}
                width={item.image.width}
                height={item.image.height}
                sizes={item.image.sizes}
                priority={item.image.priority}
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center space-y-4 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
              <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
                <CampaignRichText text={item.title} selfHref={selfHref} />
              </h2>
              {item.paragraphs.map((p, i) => (
                <p key={i}>
                  <CampaignRichText text={p} selfHref={selfHref} />
                </p>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
