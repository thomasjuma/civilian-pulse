import { Link } from "@tanstack/react-router"
import { Menu, Search, X } from "lucide-react"
import { useEffect, useId, useRef, useState } from "react"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { sections } from "./data"
import { Wordmark } from "./Wordmark"

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"

export const solidButton = cn(
  "inline-flex h-10 items-center justify-center rounded-sm bg-signal px-4 text-sm font-semibold text-signal-ink",
  "transition-colors duration-150 hover:bg-signal/85",
  focusRing,
)

const quietLink = cn(
  "text-ink-soft hover:text-ink rounded-sm text-sm transition-colors duration-150",
  focusRing,
)

interface MastheadProps {
  /** Current search text. Omit to render the masthead without search. */
  query?: string
  onQueryChange?: (value: string) => void
  /** Id of the region the search filters, for aria-controls. */
  searchTargetId?: string
}

export function Masthead({
  query,
  onQueryChange,
  searchTargetId,
}: MastheadProps) {
  const searchable = typeof query === "string" && Boolean(onQueryChange)
  const [searchOpen, setSearchOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchInputId = useId()

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus()
    }
  }, [searchOpen])

  const closeSearch = () => {
    setSearchOpen(false)
    onQueryChange?.("")
  }

  return (
    <header className="bg-paper/90 border-rule sticky top-0 z-40 border-b backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5 lg:px-8">
        <Wordmark />

        <nav
          aria-label="Sections"
          className="ml-auto hidden items-center gap-7 md:flex"
        >
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} className={quietLink}>
              {section.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-6">
          {searchable ? (
            <button
              type="button"
              onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
              aria-expanded={searchOpen}
              aria-controls={searchInputId}
              aria-label={searchOpen ? "Close search" : "Search dispatches"}
              className={cn(
                "text-ink-soft hover:text-ink hover:bg-ink/5 flex size-10 items-center justify-center rounded-sm transition-colors duration-150",
                focusRing,
              )}
            >
              {searchOpen ? (
                <X className="size-5" />
              ) : (
                <Search className="size-5" />
              )}
            </button>
          ) : null}

          <Link to="/login" className={cn(quietLink, "hidden px-2 sm:block")}>
            Log in
          </Link>
          <Link
            to="/signup"
            className={cn(solidButton, "hidden sm:inline-flex")}
          >
            File a dispatch
          </Link>

          <Sheet>
            <SheetTrigger
              className={cn(
                "text-ink-soft hover:text-ink flex size-10 items-center justify-center rounded-sm md:hidden",
                focusRing,
              )}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-paper text-ink border-rule"
            >
              <SheetHeader>
                <SheetTitle className="cp-display text-ink text-left text-lg">
                  Civilian Pulse
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Sections" className="grid gap-1 px-4">
                {sections.map((section) => (
                  <SheetClose asChild key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className={cn(
                        "text-ink hover:bg-ink/5 rounded-sm px-2 py-3 text-base",
                        focusRing,
                      )}
                    >
                      {section.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto grid gap-3 p-4">
                <SheetClose asChild>
                  <Link to="/signup" className={solidButton}>
                    File a dispatch
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    to="/login"
                    className={cn(
                      "border-rule text-ink inline-flex h-10 items-center justify-center rounded-sm border text-sm font-medium",
                      focusRing,
                    )}
                  >
                    Log in
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {searchable && searchOpen ? (
        <div className="border-rule bg-paper border-t">
          <div className="mx-auto max-w-6xl px-5 py-3 lg:px-8">
            <label
              htmlFor={searchInputId}
              className="text-ink-muted mb-1.5 block text-xs"
            >
              Search dispatches by headline, topic, ward or reporter
            </label>
            <div className="flex items-center gap-2">
              <Search
                className="text-ink-muted size-4 shrink-0"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                id={searchInputId}
                type="search"
                value={query}
                onChange={(event) => onQueryChange?.(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") closeSearch()
                }}
                placeholder="water, Kasarani, Achieng Odera"
                aria-controls={searchTargetId}
                className={cn(
                  "text-ink placeholder:text-ink-muted/70 h-9 w-full bg-transparent text-base outline-none",
                  "border-rule focus-visible:border-ink border-b transition-colors duration-150",
                )}
              />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
