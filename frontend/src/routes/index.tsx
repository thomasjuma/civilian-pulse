import "@fontsource-variable/newsreader"
import "@fontsource-variable/archivo"

import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import {
  DISPATCH_GRID_ID,
  DispatchGrid,
} from "@/components/Landing/DispatchGrid"
import { Footer } from "@/components/Landing/Footer"
import { LeadStory } from "@/components/Landing/LeadStory"
import { Masthead } from "@/components/Landing/Masthead"
import { MediaRail } from "@/components/Landing/MediaRail"
import { Newsletter } from "@/components/Landing/Newsletter"
import { PublishingSteps } from "@/components/Landing/PublishingSteps"

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      {
        title:
          "Civilian Pulse — A public record of local news, filed by residents",
      },
      {
        name: "description",
        content:
          "Citizen-filed civic reporting from your ward. Every dispatch is checked and published with its gaps showing.",
      },
      {
        property: "og:image",
        content: "/assets/images/civilian-pulse-mark.svg",
      },
    ],
  }),
})

function Home() {
  const [query, setQuery] = useState("")

  return (
    <div className="bg-paper text-ink min-h-screen flex flex-col">
      <Masthead
        query={query}
        onQueryChange={setQuery}
        searchTargetId={DISPATCH_GRID_ID}
      />

      <main className="flex-1">
        <LeadStory />
        <DispatchGrid query={query} onQueryChange={setQuery} />
        <PublishingSteps />
        <MediaRail />
        <Newsletter />
      </main>

      <Footer />
    </div>
  )
}
