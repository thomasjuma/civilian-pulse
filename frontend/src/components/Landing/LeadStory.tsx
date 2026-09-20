import { Link } from "@tanstack/react-router"
import { MapPin, ShieldCheck } from "lucide-react"

import { cn } from "@/lib/utils"
import { leadDispatch, ticker } from "./data"
import { Byline } from "./Meta"

const readLink = cn(
  "text-ink border-ink inline-flex items-center border-b-2 pb-0.5 text-sm font-semibold",
  "transition-colors duration-150 hover:border-signal hover:text-ink",
  "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-paper",
)

export function LeadStory() {
  return (
    <section className="border-rule border-b" aria-labelledby="lead-headline">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid gap-10 py-10 lg:grid-cols-12 lg:gap-12 lg:py-14">
          <article className="lg:col-span-7">
            <p className="text-ink-muted cp-rise flex items-center gap-1.5 text-sm">
              <MapPin className="size-4" aria-hidden="true" />
              {leadDispatch.ward}
            </p>

            <h1
              id="lead-headline"
              className="cp-display text-ink cp-rise mt-4 text-[2.125rem] leading-[1.04] sm:text-5xl lg:text-[3.25rem]"
              style={{ animationDelay: "60ms" }}
            >
              {leadDispatch.title}
            </h1>

            <p
              className="text-ink-soft cp-rise mt-5 max-w-[60ch] text-lg leading-relaxed"
              style={{ animationDelay: "120ms" }}
            >
              {leadDispatch.deck}
            </p>

            {leadDispatch.image ? (
              <img
                src={leadDispatch.image.src}
                alt={leadDispatch.image.alt}
                width={1400}
                height={933}
                fetchPriority="high"
                decoding="async"
                className="cp-rise mt-8 aspect-[16/9] w-full rounded-sm object-cover"
                style={{ animationDelay: "180ms" }}
              />
            ) : null}

            <div
              className="cp-rise mt-6 flex flex-wrap items-center justify-between gap-5"
              style={{ animationDelay: "240ms" }}
            >
              <Byline
                reporter={leadDispatch.reporter}
                filedOn={leadDispatch.filedOn}
                size="md"
              />
              <Link
                to="/dispatches/$slug"
                params={{ slug: leadDispatch.slug }}
                className={readLink}
              >
                Read the dispatch
              </Link>
            </div>

            <p className="text-ink-muted border-rule mt-6 flex max-w-[60ch] items-start gap-2 border-t pt-4 text-sm leading-relaxed">
              <ShieldCheck
                className="text-ink mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              {leadDispatch.verification}
            </p>
          </article>

          <aside
            className="border-rule lg:col-span-5 lg:border-l lg:pl-12"
            aria-labelledby="live-heading"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2
                id="live-heading"
                className="cp-display text-ink flex items-center gap-2.5 text-xl"
              >
                <span
                  className="bg-signal cp-beat size-2.5 rounded-full"
                  aria-hidden="true"
                />
                Filed in the last hour
              </h2>
            </div>

            <ol className="mt-5">
              {ticker.map((entry, index) => (
                <li
                  key={entry.id}
                  className="border-rule cp-rise border-b py-3.5 first:border-t"
                  style={{ animationDelay: `${180 + index * 70}ms` }}
                >
                  <div className="flex gap-4">
                    <span className="text-ink-muted w-11 shrink-0 text-sm tabular-nums">
                      {entry.time}
                    </span>
                    <div>
                      <p className="text-ink text-sm font-semibold">
                        {entry.ward}
                      </p>
                      <p className="text-ink-soft mt-0.5 text-sm leading-relaxed">
                        {entry.summary}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <p className="text-ink-muted mt-5 text-sm leading-relaxed">
              Reports land here as they come in. An editor reads every one
              before it becomes a dispatch.
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}
