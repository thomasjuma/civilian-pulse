import { Calendar, Clock, MapPin } from "lucide-react"
import type { Dispatch } from "@/components/Landing/data"
import { formatFiledDate } from "@/components/Landing/data"
import { TopicChip } from "@/components/Landing/Meta"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function ArticleHeader({ dispatch }: { dispatch: Dispatch }) {
  return (
    <header className="pt-10 pb-8 lg:pt-14 lg:pb-10">
      <div className="flex flex-wrap items-center gap-2">
        {dispatch.topics.map((topic) => (
          <TopicChip key={topic} topic={topic} />
        ))}
      </div>

      <h1 className="cp-display text-ink mt-5 max-w-[22ch] text-[2.25rem] leading-[1.02] sm:text-5xl lg:text-[3.5rem]">
        {dispatch.title}
      </h1>

      <p className="text-ink-soft mt-5 max-w-[58ch] text-lg leading-relaxed sm:text-xl">
        {dispatch.deck}
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-muted">
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarFallback className="bg-ink text-paper text-[0.6875rem] font-medium tracking-wide">
              {dispatch.reporter.initials}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-ink">{dispatch.reporter.name}</span>
        </div>

        <span className="flex items-center gap-1.5">
          <MapPin className="size-4" aria-hidden="true" />
          {dispatch.ward}
        </span>

        <span className="flex items-center gap-1.5">
          <Calendar className="size-4" aria-hidden="true" />
          {formatFiledDate(dispatch.filedOn)}
        </span>

        <span className="flex items-center gap-1.5">
          <Clock className="size-4" aria-hidden="true" />
          {dispatch.readingMinutes} min read
        </span>
      </div>
    </header>
  )
}
