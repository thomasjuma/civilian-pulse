import { Play } from "lucide-react"

import { cn } from "@/lib/utils"
import type { MediaEpisode } from "./data"
import { episodes, formatDuration } from "./data"
import { PlaybackBar, useMediaPlayback } from "./MediaPlayer"

function AudioEpisode({ episode }: { episode: MediaEpisode }) {
  const playback = useMediaPlayback(episode.durationSeconds, episode.src)

  return (
    <article className="flex flex-col gap-5 sm:flex-row sm:items-start">
      <img
        src={episode.poster.src}
        alt={episode.poster.alt}
        width={600}
        height={600}
        loading="lazy"
        decoding="async"
        className="size-32 shrink-0 rounded-sm object-cover sm:size-36"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm opacity-70">
          {episode.show}, {episode.episode}
        </p>
        <h3 className="cp-display mt-1.5 text-2xl leading-snug">
          {episode.title}
        </h3>
        <p className="mt-2 max-w-[46ch] text-sm leading-relaxed opacity-80">
          {episode.blurb}
        </p>
        <p className="mt-2 text-sm opacity-70">
          Presented by {episode.host}, {formatDuration(episode.durationSeconds)}
        </p>
        <PlaybackBar
          playback={playback}
          title={episode.title}
          src={episode.src}
          className="mt-5"
        />
        {episode.src ? null : (
          <p className="mt-3 text-xs opacity-60">
            Sample timeline. No audio file is attached to this episode yet.
          </p>
        )}
      </div>
    </article>
  )
}

function VideoEpisode({ episode }: { episode: MediaEpisode }) {
  const playback = useMediaPlayback(episode.durationSeconds, episode.src)

  return (
    <article>
      <button
        type="button"
        onClick={playback.toggle}
        aria-pressed={playback.playing}
        aria-label={
          playback.playing
            ? `Pause ${episode.title}`
            : `Play ${episode.title}, ${formatDuration(episode.durationSeconds)}`
        }
        className={cn(
          "group relative block w-full overflow-hidden rounded-sm",
          "focus-visible:ring-2 focus-visible:ring-[var(--signal)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink)] focus-visible:outline-none",
        )}
      >
        <img
          src={episode.poster.src}
          alt={episode.poster.alt}
          width={1000}
          height={563}
          loading="lazy"
          decoding="async"
          className="aspect-video w-full object-cover"
        />
        <span
          aria-hidden="true"
          className="bg-signal text-signal-ink absolute inset-0 m-auto flex size-16 items-center justify-center rounded-full transition-transform duration-150 group-hover:scale-105"
        >
          <Play className="size-7 translate-x-0.5 fill-current" />
        </span>
      </button>

      <p className="mt-5 text-sm opacity-70">
        {episode.show}, {episode.episode}
      </p>
      <h3 className="cp-display mt-1.5 text-2xl leading-snug">
        {episode.title}
      </h3>
      <p className="mt-2 max-w-[46ch] text-sm leading-relaxed opacity-80">
        {episode.blurb}
      </p>
      <p className="mt-2 text-sm opacity-70">
        Filmed by {episode.host}, {formatDuration(episode.durationSeconds)}
      </p>
      <PlaybackBar
        playback={playback}
        title={episode.title}
        src={episode.src}
        className="mt-5"
      />
      {episode.src ? null : (
        <p className="mt-3 text-xs opacity-60">
          Sample timeline. No video file is attached to this report yet.
        </p>
      )}
    </article>
  )
}

export function MediaRail() {
  const audio = episodes.find((episode) => episode.kind === "audio")
  const video = episodes.find((episode) => episode.kind === "video")

  return (
    <section
      id="listen"
      aria-labelledby="listen-heading"
      className="bg-ink text-paper scroll-mt-20"
    >
      <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-16">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 id="listen-heading" className="cp-display text-3xl sm:text-4xl">
            Listen and watch
          </h2>
          <p className="text-sm opacity-70">
            Reporting that works better with sound and pictures
          </p>
        </div>

        <div className="mt-10 grid gap-x-12 gap-y-14 lg:grid-cols-2">
          {audio ? <AudioEpisode episode={audio} /> : null}
          {video ? <VideoEpisode episode={video} /> : null}
        </div>
      </div>
    </section>
  )
}
