'use client'

import { useEffect, useRef, useState } from 'react'
import { PauseIcon, PlayIcon, SpeakerLoudIcon, SpeakerOffIcon } from '@radix-ui/react-icons'
import { useInView } from '@/hooks/use-in-view'

const controlClass =
  'rounded-full bg-scrim p-2.5 text-white backdrop-blur-sm transition-transform active:scale-90'

/**
 * Plays while at least 60% visible and pauses otherwise. Starts muted, because
 * browsers block autoplay with sound; the viewer can unmute.
 */
export function VideoPlayer({ src, label }: { src: string; label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.6 })
  const [userPaused, setUserPaused] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (inView && !userPaused) {
      video.play().catch(() => setPlaying(false))
    } else {
      video.pause()
    }
    // Pause when unmounted or when the route is hidden by <Activity>.
    return () => video.pause()
  }, [inView, userPaused])

  return (
    <div ref={ref} className="relative h-full w-full bg-black">
      <video
        ref={videoRef}
        src={src}
        aria-label={label}
        className="h-full w-full object-cover"
        loop
        muted={muted}
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onClick={() => setUserPaused(playing)}
      />
      <div className="absolute right-4 bottom-24 z-20 flex flex-col gap-3 sm:bottom-6">
        <button
          type="button"
          className={controlClass}
          onClick={() => setMuted((value) => !value)}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <SpeakerOffIcon width={20} height={20} /> : <SpeakerLoudIcon width={20} height={20} />}
        </button>
        <button
          type="button"
          className={controlClass}
          onClick={() => setUserPaused(playing)}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <PauseIcon width={20} height={20} /> : <PlayIcon width={20} height={20} />}
        </button>
      </div>
    </div>
  )
}
