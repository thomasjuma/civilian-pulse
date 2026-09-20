import { useMemo } from "react"

import type { Dispatch } from "./data"
import { gridDispatches } from "./data"
import { DispatchCard } from "./DispatchCard"

export const DISPATCH_GRID_ID = "dispatches"

const suggestions = ["Money", "Health", "Kasarani", "Achieng Odera"]

function matches(dispatch: Dispatch, needle: string) {
  const haystack = [
    dispatch.title,
    dispatch.deck,
    dispatch.ward,
    dispatch.reporter.name,
    ...dispatch.topics,
  ]
    .join(" ")
    .toLowerCase()

  return needle
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term))
}

interface DispatchGridProps {
  query: string
  onQueryChange: (value: string) => void
}

export function DispatchGrid({ query, onQueryChange }: DispatchGridProps) {
  const trimmed = query.trim().toLowerCase()

  const results = useMemo(
    () =>
      trimmed
        ? gridDispatches.filter((dispatch) => matches(dispatch, trimmed))
        : gridDispatches,
    [trimmed],
  )

  return (
    <section
      id={DISPATCH_GRID_ID}
      aria-labelledby="dispatches-heading"
      className="scroll-mt-20"
    >
      <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-16">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2
            id="dispatches-heading"
            className="cp-display text-ink text-3xl sm:text-4xl"
          >
            Latest dispatches
          </h2>
          <p aria-live="polite" className="text-ink-muted text-sm">
            {trimmed
              ? `${results.length} of ${gridDispatches.length} dispatches match “${query.trim()}”`
              : `${gridDispatches.length} dispatches this week`}
          </p>
        </div>

        {results.length > 0 ? (
          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((dispatch) => (
              <DispatchCard key={dispatch.slug} dispatch={dispatch} />
            ))}
          </div>
        ) : (
          <div className="border-rule mt-10 border-t py-12">
            <p className="cp-display text-ink text-xl">
              Nothing filed under “{query.trim()}” yet.
            </p>
            <p className="text-ink-soft mt-2 text-sm">
              Try a topic, a ward, or a reporter:
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onQueryChange(suggestion)}
                  className="border-rule text-ink hover:border-ink rounded-sm border px-3 py-1.5 text-sm transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
