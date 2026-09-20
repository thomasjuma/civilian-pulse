import { Link } from "@tanstack/react-router"

import type { Dispatch } from "@/components/Landing/data"
import { formatFiledDate } from "@/components/Landing/data"
import { cn } from "@/lib/utils"

function RelatedCard({ dispatch }: { dispatch: Dispatch }) {
  return (
    <article className="border-ink border-t pt-4">
      <p className="text-ink-muted text-xs">
        {formatFiledDate(dispatch.filedOn)} · {dispatch.readingMinutes} min
      </p>
      <h3 className="cp-display mt-2 text-lg leading-snug">
        <Link
          to="/dispatches/$slug"
          params={{ slug: dispatch.slug }}
          className={cn(
            "rounded-sm outline-none",
            "hover:decoration-signal hover:underline hover:decoration-2 hover:underline-offset-4",
            "focus-visible:ring-ink focus-visible:ring-offset-paper focus-visible:ring-2 focus-visible:ring-offset-2",
          )}
        >
          {dispatch.title}
        </Link>
      </h3>
      <p className="text-ink-soft mt-2 line-clamp-2 text-sm leading-relaxed">
        {dispatch.deck}
      </p>
    </article>
  )
}

export function RelatedDispatches({
  currentSlug,
  dispatches,
}: {
  currentSlug: string
  dispatches: Dispatch[]
}) {
  const related = dispatches
    .filter((dispatch) => dispatch.slug !== currentSlug)
    .slice(0, 3)

  if (related.length === 0) return null

  return (
    <section
      aria-labelledby="related-heading"
      className="border-rule border-t py-14 lg:py-16"
    >
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <h2
          id="related-heading"
          className="cp-display text-ink text-2xl sm:text-3xl"
        >
          More dispatches
        </h2>
        <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((dispatch) => (
            <RelatedCard key={dispatch.slug} dispatch={dispatch} />
          ))}
        </div>
      </div>
    </section>
  )
}
