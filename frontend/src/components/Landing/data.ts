/**
 * Sample content for the public landing page.
 *
 * Everything here is shaped the way a dispatches API would return it, so
 * swapping this module for generated client calls should not change the
 * components that read it.
 */

export interface Reporter {
  name: string
  initials: string
  ward: string
}

export interface Dispatch {
  slug: string
  title: string
  deck: string
  ward: string
  topics: string[]
  reporter: Reporter
  /** ISO date the dispatch was filed. */
  filedOn: string
  readingMinutes: number
  /** What an editor could confirm, and what is still open. */
  verification: string
  image?: {
    src: string
    alt: string
  }
  body: string[]
}

export interface TickerEntry {
  id: string
  /** 24-hour local time the report came in. */
  time: string
  ward: string
  summary: string
}

export interface MediaEpisode {
  id: string
  kind: "audio" | "video"
  show: string
  episode: string
  title: string
  blurb: string
  host: string
  durationSeconds: number
  poster: {
    src: string
    alt: string
  }
  /** Attach a real media file here and the player uses it instead of the preview timeline. */
  src?: string
}

export const leadDispatch: Dispatch = {
  slug: "jogoo-road-streetlights",
  title:
    "The streetlights on Jogoo Road went out in March. Nobody has claimed them.",
  deck: "Four agencies say the poles are not theirs. Residents have walked home by phone torch for seven months, and the repair line in the ward budget was spent in April.",
  ward: "Ward 12, Jogoo Road",
  topics: ["Infrastructure", "Money"],
  reporter: {
    name: "Achieng Odera",
    initials: "AO",
    ward: "Ward 12",
  },
  filedOn: "2026-09-19",
  readingMinutes: 7,
  verification:
    "Checked against the county works register and April expenditure returns. The contractor named in the tender has not responded to three calls.",
  image: {
    src: "/assets/images/landing/jogoo-road-night.jpg",
    alt: "A city at night seen from above, with lit arterial roads and dark residential blocks between them.",
  },
  body: [
    "The lights on the two-kilometre stretch between the roundabout and the market failed on a Tuesday in March. Residents reported it the same week. Seven months later the poles are still dark, and no office will say which of them owns the line.",
    "The county works department says the stretch was handed to the national roads agency during the bypass upgrade. The agency says lighting stayed with the county. The ward development committee minutes show KSh 3.1 million allocated for lighting repairs, drawn down in April against an invoice for work at a different site.",
    "We walked the stretch with four residents after dark. Two of the twelve poles have been stripped of cabling. The market traders now close an hour earlier than they did last year.",
  ],
}

export const dispatches: Dispatch[] = [
  leadDispatch,
  {
    slug: "kasarani-ambulance-night",
    title: "Three hospitals, one ambulance: a night on the Kasarani run",
    deck: "We rode with the only working ambulance in the sub-county from six in the evening until four in the morning. It made nine trips.",
    ward: "Ward 4, Kasarani",
    topics: ["Health"],
    reporter: { name: "Wanjiru Mbugua", initials: "WM", ward: "Ward 4" },
    filedOn: "2026-09-18",
    readingMinutes: 9,
    verification:
      "Trip log photographed at the dispatch desk and confirmed by the duty officer. The sub-county health office declined to comment on fleet numbers.",
    body: [
      "The ambulance is a 2014 model with 380,000 kilometres on it. Its crew works twelve-hour shifts and covers three facilities that between them serve an estimated 310,000 people.",
      "Two of the nine trips were transfers that the receiving hospital had already refused by phone. The crew drove them anyway, because the alternative was leaving the patient at the gate.",
    ],
  },
  {
    slug: "read-your-county-budget",
    title: "How to read your county budget in twenty minutes",
    deck: "The document is 340 pages and most of it does not matter to you. Here are the six tables that do, and what the numbers in them actually commit anyone to.",
    ward: "Explainer",
    topics: ["Guide", "Money"],
    reporter: { name: "Peter Kimani", initials: "PK", ward: "Desk" },
    filedOn: "2026-09-17",
    readingMinutes: 12,
    verification:
      "Written against the published 2026/27 programme-based budget. Page references are to the version tabled in July.",
    image: {
      src: "/assets/images/landing/reading-the-budget.jpg",
      alt: "A person sitting on a bench reading a broadsheet newspaper held open in front of them.",
    },
    body: [
      "Start at the programme summary, not the front. It is the only table that tells you what the county intends to do rather than what it intends to spend.",
      "Then find the development budget and compare it against last year's absorption rate. A large allocation in a department that spent a third of its budget last year is a plan, not a commitment.",
    ],
  },
  {
    slug: "ward-fund-desks",
    title: "The ward fund bought 400 desks. We found 96.",
    deck: "The delivery notes say four hundred. Head teachers at the eleven schools named signed for ninety-six between them.",
    ward: "Ward 9, Embakasi",
    topics: ["Money", "Education"],
    reporter: { name: "Achieng Odera", initials: "AO", ward: "Ward 12" },
    filedOn: "2026-09-16",
    readingMinutes: 8,
    verification:
      "Delivery notes obtained from the ward office. Nine of eleven head teachers spoke on the record. The supplier's listed office address does not exist.",
    body: [
      "The tender was awarded in February to a supplier registered three weeks earlier. The delivery notes are consecutive and dated across a single week in May.",
      "We visited all eleven schools. Two had received nothing and had not been asked to sign anything.",
    ],
  },
  {
    slug: "matatu-stage-moved",
    title: "A matatu stage moved overnight and took the shops with it",
    deck: "No notice went up. The traders who built around the old stop found out when the first matatu of the morning did not arrive.",
    ward: "Ward 7, Kibra",
    topics: ["Transport"],
    reporter: { name: "Brian Otieno", initials: "BO", ward: "Ward 7" },
    filedOn: "2026-09-15",
    readingMinutes: 6,
    verification:
      "The relocation order exists and is dated eleven days before the move. We could not find any record of it being posted or gazetted.",
    body: [
      "Fourteen kiosks sat along the approach to the old stage. Eight have closed since the move, and the rest report takings down by more than half.",
      "The transport committee says consultation happened at a meeting in August. Three of the traders listed as attending say they were not there.",
    ],
  },
  {
    slug: "river-cleanup-six-months",
    title: "Six months after the river cleanup, the plastic is back",
    deck: "The launch drew two cabinet secretaries and a drone crew. We went back in September and counted what was in the water.",
    ward: "Ward 2, Westlands",
    topics: ["Environment"],
    reporter: { name: "Fatuma Ali", initials: "FA", ward: "Ward 2" },
    filedOn: "2026-09-14",
    readingMinutes: 10,
    verification:
      "Counts taken at the same three points used by the cleanup organisers in March, using their published method.",
    body: [
      "At the bridge sampling point the March count was 41 items per ten metres of bank. In September it was 37.",
      "The organisers say the follow-up phase is funded and due to start. The funding letter they shared covers signage.",
    ],
  },
  {
    slug: "who-owns-a-pothole",
    title: "Who is responsible for a pothole? We asked all four.",
    deck: "A single junction sits under four different mandates. We sent the same photograph to each of them and waited.",
    ward: "Ward 4, Kasarani",
    topics: ["Infrastructure"],
    reporter: { name: "Wanjiru Mbugua", initials: "WM", ward: "Ward 4" },
    filedOn: "2026-09-12",
    readingMinutes: 5,
    verification:
      "All four responses are published in full alongside this dispatch. Two arrived after the deadline we gave.",
    body: [
      "The county says the junction is national. The national agency says it is county. The utility says its trench was reinstated to specification. The estate association says it pays a levy for exactly this.",
      "The photograph we sent is from January. The hole is now wide enough that matatus use the opposite lane to pass it.",
    ],
  },
]

export const gridDispatches: Dispatch[] = dispatches.filter(
  (dispatch) => dispatch.slug !== leadDispatch.slug,
)

export const ticker: TickerEntry[] = [
  {
    id: "t1",
    time: "18:42",
    ward: "Kilimani",
    summary: "Water tanker reached the estate gate, first one in nine days.",
  },
  {
    id: "t2",
    time: "18:17",
    ward: "Kasarani",
    summary: "Stage moved again overnight. Nothing posted at the old stop.",
  },
  {
    id: "t3",
    time: "17:55",
    ward: "Kibra",
    summary: "Clinic queue out to the road with one nurse on shift.",
  },
  {
    id: "t4",
    time: "17:31",
    ward: "Embakasi",
    summary: "Repair van working on the Outer Ring streetlights.",
  },
  {
    id: "t5",
    time: "16:58",
    ward: "Westlands",
    summary: "Budget hearing closed after twenty-two minutes.",
  },
]

export const episodes: MediaEpisode[] = [
  {
    id: "pulse-weekly-42",
    kind: "audio",
    show: "The Pulse Weekly",
    episode: "Episode 42",
    title: "Who owns the borehole?",
    blurb:
      "Four estates, one water source, and a management committee nobody remembers electing.",
    host: "Fatuma Ali",
    durationSeconds: 1694,
    poster: {
      src: "/assets/images/landing/pulse-weekly-artwork.jpg",
      alt: "An audience seated in a darkened hall, lit from behind.",
    },
  },
  {
    id: "budget-hearing-film",
    kind: "video",
    show: "On the record",
    episode: "Filmed 12 September",
    title: "Inside a county budget hearing",
    blurb:
      "Twelve minutes of the only public session held on a KSh 41 billion budget.",
    host: "Brian Otieno",
    durationSeconds: 726,
    poster: {
      src: "/assets/images/landing/budget-hearing.jpg",
      alt: "People seated on chairs in a meeting room facing a speaker at a lectern beside a projector screen.",
    },
  },
]

export interface PublishingStep {
  title: string
  detail: string
}

export const publishingSteps: PublishingStep[] = [
  {
    title: "Someone files it",
    detail:
      "A resident sends what they saw, where they saw it, and when. Photographs and documents attach to the report.",
  },
  {
    title: "An editor checks it",
    detail:
      "We match the account against public records, call the office it names, and write down what we could not confirm.",
  },
  {
    title: "It publishes with its gaps",
    detail:
      "Every dispatch carries a note saying what is verified and what is still open. Nothing gets smoothed over.",
  },
]

export const sections = [
  { id: "dispatches", label: "Dispatches" },
  { id: "how-it-works", label: "How it works" },
  { id: "listen", label: "Listen and watch" },
  { id: "brief", label: "The Brief" },
] as const

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
})

export function formatFiledDate(iso: string): string {
  return dateFormatter.format(new Date(`${iso}T00:00:00`))
}

export function formatDuration(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.round(totalSeconds))
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function getDispatch(slug: string): Dispatch | undefined {
  return dispatches.find((dispatch) => dispatch.slug === slug)
}
