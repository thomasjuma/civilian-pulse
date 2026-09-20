import { Link } from "@tanstack/react-router"

import { cn } from "@/lib/utils"
import type { Dispatch } from "./data"
import { Byline, TopicChip } from "./Meta"

interface DispatchCardProps {
  dispatch: Dispatch
  className?: string
}

export function DispatchCard({ dispatch, className }: DispatchCardProps) {
  return (
    <article
      className={cn("border-ink flex flex-col border-t pt-5", className)}
    >
      <div className="flex flex-wrap items-center gap-2">
        {dispatch.topics.map((topic) => (
          <TopicChip key={topic} topic={topic} />
        ))}
      </div>

      {dispatch.image ? (
        <img
          src={dispatch.image.src}
          alt={dispatch.image.alt}
          width={900}
          height={600}
          loading="lazy"
          decoding="async"
          className="mt-4 aspect-[3/2] w-full rounded-sm object-cover"
        />
      ) : null}

      <h3 className="cp-display text-ink mt-4 text-[1.375rem] leading-snug">
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

      <p className="text-ink-soft mt-3 line-clamp-3 text-[0.9375rem] leading-relaxed">
        {dispatch.deck}
      </p>

      <div className="mt-5 flex items-end justify-between gap-4 pt-1">
        <Byline reporter={dispatch.reporter} filedOn={dispatch.filedOn} />
        <span className="text-ink-muted shrink-0 text-xs">
          {dispatch.readingMinutes} min read
        </span>
      </div>
    </article>
  )
}
