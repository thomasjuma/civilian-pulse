import type { Dispatch } from "@/components/Landing/data"

export function ArticleBody({ dispatch }: { dispatch: Dispatch }) {
  return (
    <div className="text-ink">
      {dispatch.image ? (
        <figure className="mb-10">
          <img
            src={dispatch.image.src}
            alt={dispatch.image.alt}
            width={1400}
            height={933}
            loading="eager"
            decoding="async"
            className="aspect-[16/9] w-full rounded-sm object-cover"
          />
          <figcaption className="text-ink-muted mt-2 text-sm">
            {dispatch.image.alt}
          </figcaption>
        </figure>
      ) : null}

      <div className="max-w-[68ch] font-[family-name:var(--font-display)] text-lg leading-[1.68] sm:text-xl sm:leading-[1.72]">
        {dispatch.body.map((paragraph, index) => (
          <p
            key={index}
            className={
              index === 0
                ? "mb-6 text-xl leading-[1.68] sm:text-2xl sm:leading-[1.6]"
                : "mb-6"
            }
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  )
}
