import { CheckCircle2, Link2, Share2 } from "lucide-react"
import { useState } from "react"
import type { Dispatch } from "@/components/Landing/data"
import { TopicChip } from "@/components/Landing/Meta"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"

function CopyLinkButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "border-rule text-ink hover:border-ink inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-sm transition-colors duration-150",
        focusRing,
      )}
    >
      <Link2 className="size-4" />
      {copied ? "Copied" : "Copy link"}
    </button>
  )
}

export function ArticleSidebar({ dispatch }: { dispatch: Dispatch }) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
      <div className="bg-paper-raised border-rule rounded-sm border p-5">
        <h2 className="text-ink cp-display text-lg">Reporter</h2>
        <div className="mt-4 flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarFallback className="bg-ink text-paper text-sm font-medium tracking-wide">
              {dispatch.reporter.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-ink font-semibold">{dispatch.reporter.name}</p>
            <p className="text-ink-muted text-sm">{dispatch.reporter.ward}</p>
          </div>
        </div>
      </div>

      <div className="bg-paper-raised border-rule rounded-sm border p-5">
        <h2 className="text-ink cp-display flex items-center gap-2 text-lg">
          <CheckCircle2 className="text-signal size-5" />
          What we verified
        </h2>
        <p className="text-ink-soft mt-3 text-sm leading-relaxed">
          {dispatch.verification}
        </p>
      </div>

      <div className="bg-paper-raised border-rule rounded-sm border p-5">
        <h2 className="text-ink cp-display text-lg">Topics</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {dispatch.topics.map((topic) => (
            <TopicChip key={topic} topic={topic} />
          ))}
        </div>
      </div>

      <div className="bg-paper-raised border-rule rounded-sm border p-5">
        <h2 className="text-ink cp-display flex items-center gap-2 text-lg">
          <Share2 className="size-4" />
          Share
        </h2>
        <div className="mt-3">
          <CopyLinkButton />
        </div>
      </div>
    </aside>
  )
}
