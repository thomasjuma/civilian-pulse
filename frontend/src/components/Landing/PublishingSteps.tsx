import { publishingSteps } from "./data"

/**
 * The one loud block on the page. Numbered because filing, checking and
 * publishing genuinely happen in that order.
 */
export function PublishingSteps() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="bg-signal text-signal-ink scroll-mt-20"
    >
      <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-16">
        <h2
          id="how-it-works-heading"
          className="cp-display max-w-[24ch] text-3xl leading-tight sm:text-4xl"
        >
          How a dispatch gets published
        </h2>

        <ol className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-3">
          {publishingSteps.map((step, index) => (
            <li key={step.title} className="border-signal-ink/25 border-t pt-5">
              <span className="cp-display block text-2xl leading-none opacity-55">
                {index + 1}
              </span>
              <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
              <p className="mt-2 max-w-[42ch] text-sm leading-relaxed opacity-85">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
