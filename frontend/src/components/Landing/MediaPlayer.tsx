import { Pause, Play } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { formatDuration } from "./data"

const TICK_MS = 250

/**
 * Drives playback for one episode.
 *
 * With a `src` the real <audio> element is the source of truth. Without one
 * the timeline still runs so the control can be used and tested, and the card
 * says plainly that no file is attached.
 */
export function useMediaPlayback(fallbackDuration: number, src?: string) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(fallbackDuration)

  useEffect(() => {
    if (!playing || src) return
    const id = window.setInterval(() => {
      setCurrentTime((value) => Math.min(value + TICK_MS / 1000, duration))
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [playing, src, duration])

  useEffect(() => {
    if (!src && currentTime >= duration) {
      setPlaying(false)
    }
  }, [src, currentTime, duration])

  const toggle = () => {
    const audio = audioRef.current
    if (src && audio) {
      if (audio.paused) {
        void audio.play()
      } else {
        audio.pause()
      }
      return
    }
    if (playing) {
      setPlaying(false)
      return
    }
    if (currentTime >= duration) {
      setCurrentTime(0)
    }
    setPlaying(true)
  }

  const seek = (seconds: number) => {
    setCurrentTime(seconds)
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = seconds
    }
  }

  return {
    audioRef,
    playing,
    setPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    toggle,
    seek,
  }
}

type Playback = ReturnType<typeof useMediaPlayback>

interface PlaybackBarProps {
  playback: Playback
  title: string
  src?: string
  className?: string
}

export function PlaybackBar({
  playback,
  title,
  src,
  className,
}: PlaybackBarProps) {
  const {
    audioRef,
    playing,
    setPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    toggle,
    seek,
  } = playback

  const elapsed = formatDuration(currentTime)
  const total = formatDuration(duration)

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {src ? (
        // biome-ignore lint: transcripts ship with the episode, not as a track file
        <audio
          ref={audioRef}
          src={src}
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(event) =>
            setCurrentTime(event.currentTarget.currentTime)
          }
          onLoadedMetadata={(event) => {
            const loaded = event.currentTarget.duration
            if (Number.isFinite(loaded) && loaded > 0) setDuration(loaded)
          }}
        />
      ) : null}

      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
        className="bg-signal text-signal-ink flex size-11 shrink-0 items-center justify-center rounded-full transition-colors duration-150 hover:bg-signal/85 focus-visible:ring-2 focus-visible:ring-[var(--signal)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink)] focus-visible:outline-none"
      >
        {playing ? (
          <Pause className="size-5 fill-current" />
        ) : (
          <Play className="size-5 translate-x-px fill-current" />
        )}
      </button>

      <input
        type="range"
        min={0}
        max={Math.max(duration, 1)}
        step={1}
        value={Math.round(currentTime)}
        onChange={(event) => seek(Number(event.target.value))}
        aria-label={`Seek within ${title}`}
        aria-valuetext={`${elapsed} of ${total}`}
        className="h-1.5 w-full cursor-pointer accent-[var(--signal)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--signal)]"
      />

      <span className="w-20 shrink-0 text-right text-xs tabular-nums opacity-70">
        {elapsed} / {total}
      </span>
    </div>
  )
}
