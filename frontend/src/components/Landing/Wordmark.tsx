import { Link } from "@tanstack/react-router"

import { cn } from "@/lib/utils"

interface WordmarkProps {
  className?: string
  /** Renders plain text instead of a link, for use inside another link. */
  asLink?: boolean
}

function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      className={cn("size-7 shrink-0", className)}
    >
      <rect width="32" height="32" rx="7" className="fill-ink" />
      <path
        d="M5 17.5h4.6l2.5-7.8 3.6 12.6 2.8-8.1 1.7 3.3H27"
        fill="none"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-signal"
      />
    </svg>
  )
}

export function Wordmark({ className, asLink = true }: WordmarkProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Mark />
      <span className="cp-display text-ink text-xl leading-none">
        Civilian Pulse
      </span>
    </span>
  )

  if (!asLink) {
    return content
  }

  return (
    <Link
      to="/"
      className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      aria-label="Civilian Pulse, home"
    >
      {content}
    </Link>
  )
}
