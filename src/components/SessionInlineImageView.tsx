import type { SessionInlineImage } from "@/data/sessions";

type SessionInlineImageViewProps = {
  image: SessionInlineImage;
};

export function SessionInlineImageView({ image }: SessionInlineImageViewProps) {
  return (
    <figure className="my-2 flex flex-col items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt}
        className="max-h-[min(50vh,28rem)] w-auto max-w-full rounded border border-amber-900/15 bg-amber-100/30 shadow-sm dark:border-zinc-600/50 dark:bg-zinc-800/50"
        loading="lazy"
      />
      {image.caption ? (
        <figcaption className="max-w-lg text-center text-sm italic text-amber-900/75 dark:text-zinc-400">
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
