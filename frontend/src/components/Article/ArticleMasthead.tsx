import { Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"

import { Wordmark } from "@/components/Landing/Wordmark"
import { cn } from "@/lib/utils"

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"

const quietLink = cn(
  "text-ink-soft hover:text-ink rounded-sm text-sm transition-colors duration-150",
  focusRing,
)

const solidButton = cn(
  "inline-flex h-10 items-center justify-center rounded-sm bg-signal px-4 text-sm font-semibold text-signal-ink",
  "transition-colors duration-150 hover:bg-signal/85",
  focusRing,
)

export function ArticleMasthead() {
  return (
    <header className="bg-paper/90 border-rule sticky top-0 z-40 border-b backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5 lg:px-8">
        <Wordmark />

        <Link
          to="/"
          className={cn(
            quietLink,
            "ml-auto hidden items-center gap-1.5 sm:inline-flex",
          )}
        >
          <ArrowLeft className="size-4" />
          All dispatches
        </Link>

        <div className="ml-auto flex items-center gap-2 sm:ml-6">
          <Link to="/login" className={cn(quietLink, "hidden px-2 sm:block")}>
            Log in
          </Link>
          <Link to="/signup" className={solidButton}>
            File a dispatch
          </Link>
        </div>
      </div>
    </header>
  )
}
