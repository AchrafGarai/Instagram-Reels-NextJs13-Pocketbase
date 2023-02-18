'use client'
import React, { RefObject, useRef, useState } from 'react'
import { InView } from 'react-intersection-observer'
import { PlayIcon, PauseIcon } from '@radix-ui/react-icons'

function Player({ videoUrl }: { videoUrl: string }) {
  const [isVisible, setIsVIsible] = useState(false)
  const [playing, setPlaying] = useState(false)

  const vidRef = useRef() as RefObject<HTMLVideoElement>

  const togglePlay = (visible: boolean) => {
    if (visible) {
      setPlaying(true)
      if (vidRef.current) {
        vidRef.current.play().catch((e) => {
          console.log(e)
        })
        vidRef.current.muted = false
      }
    } else {
      setPlaying(false)
      if (vidRef.current) {
        vidRef.current.pause()
        vidRef.current.muted = true
      }
    }
  }

  return (
    <>
      <InView
        className="h-full"
        onChange={(inView) => {
          setIsVIsible(inView)
          togglePlay(inView)
          //   setPlaying(inView)
        }}
      >
        <div className="flex flex-col justify-center h-full">
          <video
            ref={vidRef}
            src={videoUrl}
            loop={true}
            autoPlay
            muted
            className="min-h-full object-cover"
          />

          <button
            onClick={() => togglePlay(!playing)}
            className="absolute z-20 right-7 bottom-16 text-white sm:bottom-8"
          >
            {playing ? (
              <PauseIcon width={24} height={24} />
            ) : (
              <PlayIcon width={24} height={24} />
            )}
          </button>
        </div>
      </InView>
    </>
  )
}

export default Player
