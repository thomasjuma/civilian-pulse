import { Mail } from "lucide-react"
import { useId, useState } from "react"

import { cn } from "@/lib/utils"

const solidButton = cn(
  "inline-flex h-10 items-center justify-center rounded-sm bg-signal px-4 text-sm font-semibold text-signal-ink",
  "transition-colors duration-150 hover:bg-signal/85",
  "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
)

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const headingId = useId()
  const errorId = useId()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Client-side validation only; no backend yet
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (isValid) {
      setSubmitted(true)
      setEmail("")
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <section
      id="brief"
      aria-labelledby={headingId}
      className="border-rule border-t"
    >
      <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-16">
        <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-5">
          <h2 id={headingId} className="cp-display text-ink text-2xl">
            Get The Brief
          </h2>

          <p className="text-ink-soft text-sm leading-relaxed">
            A summary of the week's dispatches, every Friday evening. We never
            share your address.
          </p>

          <div className="space-y-2">
            <label htmlFor="email" className="text-ink text-sm font-medium">
              Your email
            </label>
            <div className="flex gap-2">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                aria-describedby={submitted ? undefined : errorId}
                required
                className={cn(
                  "border-rule text-ink placeholder:text-ink-muted/70 flex-1 rounded-sm border px-3 h-10 text-sm",
                  "bg-transparent outline-none transition-colors duration-150",
                  "focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-ink/30",
                )}
              />
              <button type="submit" className={solidButton}>
                <Mail className="size-4" />
                <span className="hidden sm:inline">Subscribe</span>
              </button>
            </div>
            {submitted ? (
              <p className="text-signal text-sm font-medium">
                ✓ Check your inbox
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  )
}
