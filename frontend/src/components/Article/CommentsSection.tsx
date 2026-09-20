import { MessageCircle, Send } from "lucide-react"
import { useEffect, useId, useMemo, useState } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"

interface ArticleComment {
  id: string
  name: string
  initials: string
  text: string
  createdAt: string
}

const sampleComments: ArticleComment[] = [
  {
    id: "sample-1",
    name: "Miriam Njeri",
    initials: "MN",
    text: "The split between the county and the roads agency is exactly what residents keep running into. Please keep following the repair invoice.",
    createdAt: "19 September 2026",
  },
  {
    id: "sample-2",
    name: "David Ouma",
    initials: "DO",
    text: "I live near the market. The dark stretch is not just inconvenient. It changes when people can safely get home.",
    createdAt: "19 September 2026",
  },
]

function storageKey(slug: string) {
  return `civilian-pulse-comments:${slug}`
}

function readComments(slug: string): ArticleComment[] {
  try {
    const saved = window.localStorage.getItem(storageKey(slug))
    if (!saved) return sampleComments
    const parsed: unknown = JSON.parse(saved)
    if (!Array.isArray(parsed)) return sampleComments
    return parsed.filter(
      (comment): comment is ArticleComment =>
        typeof comment === "object" &&
        comment !== null &&
        typeof comment.id === "string" &&
        typeof comment.name === "string" &&
        typeof comment.initials === "string" &&
        typeof comment.text === "string" &&
        typeof comment.createdAt === "string",
    )
  } catch {
    return sampleComments
  }
}

function writeComments(slug: string, comments: ArticleComment[]) {
  try {
    window.localStorage.setItem(storageKey(slug), JSON.stringify(comments))
  } catch {
    // The comment still appears for this session when storage is unavailable.
  }
}

function initialsFor(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function CommentCard({ comment }: { comment: ArticleComment }) {
  return (
    <article className="border-rule border-t pt-5">
      <div className="flex items-start gap-3">
        <Avatar className="size-9 shrink-0">
          <AvatarFallback className="bg-ink text-paper text-xs font-medium">
            {comment.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-ink text-sm font-semibold">{comment.name}</h3>
            <time className="text-ink-muted text-xs">{comment.createdAt}</time>
          </div>
          <p className="text-ink-soft mt-2 text-sm leading-relaxed">
            {comment.text}
          </p>
        </div>
      </div>
    </article>
  )
}

export function CommentsSection({ slug }: { slug: string }) {
  const nameId = useId()
  const commentId = useId()
  const errorId = useId()
  const [comments, setComments] = useState<ArticleComment[]>([])
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setComments(readComments(slug))
    setName("")
    setText("")
    setError("")
    setSubmitted(false)
  }, [slug])

  const countLabel = useMemo(() => {
    if (comments.length === 0) return "No comments yet"
    return `${comments.length} ${comments.length === 1 ? "comment" : "comments"}`
  }, [comments.length])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cleanName = name.trim()
    const cleanText = text.trim()

    if (!cleanName || cleanName.length < 2) {
      setError("Add your name so readers know who is speaking.")
      return
    }
    if (!cleanText || cleanText.length < 12) {
      setError("Your comment needs at least 12 characters.")
      return
    }
    if (cleanText.length > 800) {
      setError("Keep your comment under 800 characters.")
      return
    }

    const comment: ArticleComment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: cleanName,
      initials: initialsFor(cleanName),
      text: cleanText,
      createdAt: "Just now",
    }
    const nextComments = [comment, ...comments]
    setComments(nextComments)
    writeComments(slug, nextComments)
    setName("")
    setText("")
    setError("")
    setSubmitted(true)
    window.setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section
      id="comments"
      aria-labelledby="comments-heading"
      className="border-rule scroll-mt-20 border-t py-14 lg:py-16"
    >
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="flex items-baseline gap-3">
              <MessageCircle
                className="text-signal size-6"
                aria-hidden="true"
              />
              <h2
                id="comments-heading"
                className="cp-display text-ink text-3xl"
              >
                Join the conversation
              </h2>
            </div>
            <p className="text-ink-muted mt-2 text-sm" aria-live="polite">
              {countLabel}. Keep it specific, respectful, and connected to the
              story.
            </p>

            <div className="mt-8 space-y-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <CommentCard key={comment.id} comment={comment} />
                ))
              ) : (
                <p className="border-rule border-t pt-5 text-sm text-ink-muted">
                  Be the first person to add a view on this dispatch.
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <form
              onSubmit={handleSubmit}
              className="bg-paper-raised border-rule rounded-sm border p-5 sm:p-6"
              noValidate
            >
              <h3 className="cp-display text-ink text-xl">Add your view</h3>
              <p className="text-ink-muted mt-2 text-sm leading-relaxed">
                Your comment is saved in this browser for now. A connected
                comments service can replace this local storage later.
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor={nameId}
                    className="text-ink text-sm font-medium"
                  >
                    Name
                  </label>
                  <input
                    id={nameId}
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    className={cn(
                      "border-rule text-ink placeholder:text-ink-muted/70 mt-1.5 h-10 w-full rounded-sm border bg-transparent px-3 text-sm",
                      "outline-none transition-colors duration-150 focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-ink/30",
                    )}
                  />
                </div>

                <div>
                  <label
                    htmlFor={commentId}
                    className="text-ink text-sm font-medium"
                  >
                    Your comment
                  </label>
                  <textarea
                    id={commentId}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="What stood out to you?"
                    rows={5}
                    maxLength={800}
                    aria-describedby={error ? errorId : undefined}
                    className={cn(
                      "border-rule text-ink placeholder:text-ink-muted/70 mt-1.5 w-full resize-y rounded-sm border bg-transparent px-3 py-2.5 text-sm leading-relaxed",
                      "outline-none transition-colors duration-150 focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-ink/30",
                    )}
                  />
                  <div className="mt-1 flex justify-between gap-3">
                    <p className="text-ink-muted text-xs">800 characters max</p>
                    <p className="text-ink-muted text-xs tabular-nums">
                      {text.length}/800
                    </p>
                  </div>
                </div>

                {error ? (
                  <p
                    id={errorId}
                    role="alert"
                    className="text-sm text-red-700 dark:text-red-300"
                  >
                    {error}
                  </p>
                ) : null}
                {submitted ? (
                  <p role="status" className="text-sm font-medium text-ink">
                    Your view is now part of the conversation.
                  </p>
                ) : null}

                <button
                  type="submit"
                  className={cn(
                    "bg-signal text-signal-ink inline-flex h-10 items-center justify-center gap-2 rounded-sm px-4 text-sm font-semibold",
                    "transition-colors duration-150 hover:bg-signal/85",
                    focusRing,
                  )}
                >
                  <Send className="size-4" aria-hidden="true" />
                  Publish comment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
