import "@fontsource-variable/newsreader"
import "@fontsource-variable/archivo"

import { createFileRoute, Link } from "@tanstack/react-router"

import { ArticleBody } from "@/components/Article/ArticleBody"
import { ArticleHeader } from "@/components/Article/ArticleHeader"
import { ArticleMasthead } from "@/components/Article/ArticleMasthead"
import { ArticleNewsletter } from "@/components/Article/ArticleNewsletter"
import { ArticleSidebar } from "@/components/Article/ArticleSidebar"
import { CommentsSection } from "@/components/Article/CommentsSection"
import { RelatedDispatches } from "@/components/Article/RelatedDispatches"
import { dispatches, getDispatch } from "@/components/Landing/data"
import { Footer } from "@/components/Landing/Footer"

export const Route = createFileRoute("/dispatches/$slug")({
  component: DispatchDetail,
  head: ({ params }) => {
    const dispatch = getDispatch(params.slug)
    return {
      meta: [
        {
          title: dispatch
            ? `${dispatch.title} — Civilian Pulse`
            : "Dispatch not found",
        },
        {
          name: "description",
          content: dispatch?.deck,
        },
      ],
    }
  },
})

function DispatchDetail() {
  const { slug } = Route.useParams()
  const dispatch = getDispatch(slug)

  if (!dispatch) {
    return (
      <div className="bg-paper text-ink flex min-h-screen flex-col">
        <ArticleMasthead />
        <main className="flex flex-1 items-center justify-center px-5 py-20">
          <div className="text-center">
            <h1 className="cp-display text-3xl">Dispatch not found</h1>
            <p className="text-ink-muted mt-3">No dispatch matches “{slug}”.</p>
            <Link
              to="/"
              className="bg-signal text-signal-ink mt-6 inline-flex h-10 items-center rounded-sm px-4 text-sm font-semibold"
            >
              Back to all dispatches
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="bg-paper text-ink flex min-h-screen flex-col">
      <ArticleMasthead />

      <main className="flex-1">
        <article>
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <ArticleHeader dispatch={dispatch} />

            <div className="grid gap-10 pb-14 lg:grid-cols-12 lg:gap-12 lg:pb-20">
              <div className="lg:col-span-8">
                <ArticleBody dispatch={dispatch} />
              </div>

              <div className="lg:col-span-4">
                <ArticleSidebar dispatch={dispatch} />
              </div>
            </div>
          </div>
        </article>

        <CommentsSection slug={slug} />
        <RelatedDispatches currentSlug={slug} dispatches={dispatches} />
        <ArticleNewsletter />
      </main>

      <Footer />
    </div>
  )
}
