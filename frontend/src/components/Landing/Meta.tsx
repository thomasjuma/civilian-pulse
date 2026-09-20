import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { formatFiledDate, type Reporter } from "./data"

export function TopicChip({ topic }: { topic: string }) {
  return (
    <span className="border-rule text-ink-muted inline-flex items-center rounded-sm border px-2 py-0.5 text-xs leading-5">
      {topic}
    </span>
  )
}

interface BylineProps {
  reporter: Reporter
  filedOn: string
  className?: string
  size?: "sm" | "md"
}

export function Byline({
  reporter,
  filedOn,
  className,
  size = "sm",
}: BylineProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Avatar className={size === "md" ? "size-9" : "size-7"}>
        <AvatarFallback className="bg-ink text-paper text-[0.6875rem] font-medium tracking-wide">
          {reporter.initials}
        </AvatarFallback>
      </Avatar>
      <div className="leading-tight">
        <p
          className={cn(
            "text-ink font-medium",
            size === "md" ? "text-sm" : "text-[0.8125rem]",
          )}
        >
          {reporter.name}
        </p>
        <p className="text-ink-muted text-xs">
          {reporter.ward}, filed {formatFiledDate(filedOn)}
        </p>
      </div>
    </div>
  )
}
