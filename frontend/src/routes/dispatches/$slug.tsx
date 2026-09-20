import { createFileRoute } from "@tanstack/react-router"

import { getDispatch } from "@/components/Landing/data"

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Not found</h1>
          <p className="text-muted-foreground">
            Dispatch "{slug}" does not exist.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="prose prose-invert max-w-4xl mx-auto py-12 px-4">
      <h1>{dispatch.title}</h1>
      <p>{dispatch.deck}</p>
      {dispatch.image ? (
        <img src={dispatch.image.src} alt={dispatch.image.alt} />
      ) : null}
      {dispatch.body.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  )
}
