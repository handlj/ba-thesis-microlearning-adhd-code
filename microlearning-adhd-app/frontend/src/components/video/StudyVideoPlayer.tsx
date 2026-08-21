import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react'
import '@assets/styles/VideoPlayer.css'
import { copy } from '../../content/copy.ts'
import type { VideoChapter } from '../../content/videoChapters.ts'
import type { StudyInteractionPayload } from '../../services/index.ts'
import type { VideoPlayerFeatures } from '../../utils/videoFeatures.ts'
import VideoScrubber from './VideoScrubber.tsx'
import { buildSegments } from './chapterSegments.ts'
import { formatDuration } from './formatDuration.ts'
import { videoIcons } from '@assets/icons/videoIcons.tsx'

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2] as const

const SEEK_LOG_THRESHOLD_SECONDS = 1

const CONTROLS_HIDE_DELAY_MS = 2600

const KEYBOARD_SEEK_SECONDS = 5

const BASE_FEATURES: VideoPlayerFeatures = {
  chapterMarkers: false,
  chapterNavigation: false,
  chapterLabels: false,
  playbackSpeed: false,
}

export type StudyVideoPlayerHandle = {
  requestSeek: (seconds: number) => void
}

type StudyVideoPlayerProps = {
  ref?: Ref<StudyVideoPlayerHandle>
  src: string
  eventPrefix: string
  eventPayload?: StudyInteractionPayload
  onLogInteraction?: (eventType: string, payload?: StudyInteractionPayload) => void
  onEnded?: () => void
  onLoadedMetadata?: () => void
  initialSeekSeconds?: number | null
  chapters?: readonly VideoChapter[]
  features?: VideoPlayerFeatures
}

function StudyVideoPlayer({
  ref,
  src,
  eventPrefix,
  eventPayload,
  onLogInteraction,
  onEnded,
  onLoadedMetadata,
  initialSeekSeconds = null,
  chapters = [],
  features = BASE_FEATURES,
}: StudyVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const speedMenuRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [hasEnded, setHasEnded] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [bufferedSeconds, setBufferedSeconds] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [areControlsVisible, setAreControlsVisible] = useState(true)
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false)

  const previousTimeRef = useRef(0)
  const isScrubbingRef = useRef(false)
  const suppressSeekLogRef = useRef(false)
  const pendingSeekRef = useRef<number | null>(initialSeekSeconds)
  const hideControlsTimerRef = useRef<number | null>(null)
  const volumeBeforeCommitRef = useRef(1)
  const isPlayingRef = useRef(false)

  const labels = copy.video.player

  const loggingRef = useRef({ onLogInteraction, eventPayload })
  useEffect(() => {
    loggingRef.current = { onLogInteraction, eventPayload }
  })

  const log = useCallback(
    (suffix: string, extra?: StudyInteractionPayload) => {
      const { onLogInteraction: handler, eventPayload: payload } = loggingRef.current
      handler?.(`${eventPrefix}_${suffix}`, { ...payload, ...extra })
    },
    [eventPrefix],
  )

  const logSeekDelta = useCallback(
    (nextTime: number) => {
      const previousTime = previousTimeRef.current
      const deltaSeconds = nextTime - previousTime

      if (deltaSeconds > SEEK_LOG_THRESHOLD_SECONDS) {
        log('skipped', {
          fromSeconds: Math.round(previousTime),
          toSeconds: Math.round(nextTime),
        })
      }

      if (deltaSeconds < -SEEK_LOG_THRESHOLD_SECONDS) {
        log('rewatched', {
          fromSeconds: Math.round(previousTime),
          toSeconds: Math.round(nextTime),
        })
      }

      previousTimeRef.current = nextTime
    },
    [log],
  )

  const activeFeatures = features
  const markedChapters = activeFeatures.chapterMarkers ? chapters : []
  const segments = buildSegments(markedChapters, duration)
  const currentChapter =
    activeFeatures.chapterLabels && segments.length > 0
      ? (segments.find(
          (segment) => currentTime >= segment.startSeconds && currentTime < segment.endSeconds,
        ) ?? segments[segments.length - 1])
      : null

  // --- controls ---

  const clearHideTimer = useCallback(() => {
    if (hideControlsTimerRef.current !== null) {
      window.clearTimeout(hideControlsTimerRef.current)
      hideControlsTimerRef.current = null
    }
  }, [])

  const showControls = useCallback(
    (autoHide: boolean) => {
      setAreControlsVisible(true)
      clearHideTimer()

      if (autoHide) {
        hideControlsTimerRef.current = window.setTimeout(() => {
          setAreControlsVisible(false)
        }, CONTROLS_HIDE_DELAY_MS)
      }
    },
    [clearHideTimer],
  )

  const revealControls = useCallback(() => {
    showControls(isPlayingRef.current)
  }, [showControls])

  useEffect(() => clearHideTimer, [clearHideTimer])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  useEffect(() => {
    if (!isSpeedMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!speedMenuRef.current?.contains(event.target as Node)) {
        setIsSpeedMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isSpeedMenuOpen])

  // --- transport ---

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    if (video.paused) {
      void video.play().catch(() => {})
      log('played', { atSeconds: Math.round(video.currentTime) })
    } else {
      video.pause()
      log('paused', { atSeconds: Math.round(video.currentTime) })
    }
  }, [log])

  const seekTo = useCallback((seconds: number) => {
    const video = videoRef.current
    if (!video || !Number.isFinite(video.duration)) {
      return
    }

    const target = Math.min(video.duration, Math.max(0, seconds))
    video.currentTime = target
    setCurrentTime(target)
  }, [])

  const requestSeek = useCallback((seconds: number) => {
    const video = videoRef.current
    const target = Math.max(0, seconds)

    if (!video || !Number.isFinite(video.duration)) {
      pendingSeekRef.current = target
      return
    }

    const clamped = Math.min(video.duration, target)
    if (Math.abs(video.currentTime - clamped) < 0.01) return

    previousTimeRef.current = clamped
    suppressSeekLogRef.current = true
    video.currentTime = clamped
    setCurrentTime(clamped)
  }, [])

  useImperativeHandle(ref, () => ({ requestSeek }), [requestSeek])

  const changeVolume = useCallback((nextVolume: number) => {
    const video = videoRef.current
    if (!video) {
      return
    }

    video.volume = nextVolume
    video.muted = nextVolume === 0
  }, [])

  const commitVolume = useCallback(() => {
    const video = videoRef.current
    if (!video || video.volume === volumeBeforeCommitRef.current) {
      return
    }

    log('volume_changed', {
      fromPercent: Math.round(volumeBeforeCommitRef.current * 100),
      toPercent: Math.round(video.volume * 100),
      atSeconds: Math.round(video.currentTime),
    })
    volumeBeforeCommitRef.current = video.volume
  }, [log])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    video.muted = !video.muted
    log('volume_changed', {
      fromPercent: Math.round(video.volume * 100),
      toPercent: video.muted ? 0 : Math.round(video.volume * 100),
      muted: video.muted,
      atSeconds: Math.round(video.currentTime),
    })
  }, [log])

  const changePlaybackRate = useCallback(
    (rate: number) => {
      const video = videoRef.current
      if (!video) {
        return
      }

      const previousRate = video.playbackRate
      video.playbackRate = rate
      setPlaybackRate(rate)
      setIsSpeedMenuOpen(false)

      if (previousRate !== rate) {
        log('speed_changed', {
          fromRate: previousRate,
          toRate: rate,
          atSeconds: Math.round(video.currentTime),
        })
      }
    },
    [log],
  )

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    if (document.fullscreenElement === container) {
      void document.exitFullscreen()
      log('fullscreen_exited')
    } else {
      void container.requestFullscreen().catch(() => {})
      log('fullscreen_entered')
    }
  }, [log])

  // --- keyboard ---

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // The scrubber and the buttons handle their own keys; intercepting here
    // would make Space activate a focused button and toggle playback at once.
    const target = event.target as HTMLElement
    if (target.closest('button, input, [role="slider"]')) {
      return
    }

    const video = videoRef.current
    if (!video) {
      return
    }

    if (event.key === ' ' || event.key === 'k') {
      event.preventDefault()
      togglePlay()
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      seekTo(video.currentTime - KEYBOARD_SEEK_SECONDS)
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      seekTo(video.currentTime + KEYBOARD_SEEK_SECONDS)
    }

    if (event.key === 'm') {
      event.preventDefault()
      toggleMute()
    }

    if (event.key === 'f') {
      event.preventDefault()
      toggleFullscreen()
    }
  }

  // --- render ---

  const playLabel = hasEnded ? labels.replay : isPlaying ? labels.pause : labels.play
  const playIcon = hasEnded ? videoIcons.replay : isPlaying ? videoIcons.pause : videoIcons.play

  return (
    <div
      ref={containerRef}
      className={[
        'video-player',
        areControlsVisible ? 'video-player--controls-visible' : '',
        isPlaying ? 'video-player--playing' : '',
        isFullscreen ? 'video-player--fullscreen' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="region"
      aria-label={labels.region}
      onPointerMove={revealControls}
      onPointerLeave={() => {
        if (isPlaying) {
          setAreControlsVisible(false)
        }
      }}
      onFocus={revealControls}
      onKeyDown={handleKeyDown}
    >
      <video
        ref={videoRef}
        className="video-player__media"
        preload="metadata"
        playsInline
        onClick={togglePlay}
        onPlay={() => {
          isPlayingRef.current = true
          setIsPlaying(true)
          setHasEnded(false)
          showControls(true)
        }}
        onPause={() => {
          isPlayingRef.current = false
          setIsPlaying(false)
          showControls(false)
        }}
        onEnded={() => {
          isPlayingRef.current = false
          setIsPlaying(false)
          setHasEnded(true)
          showControls(false)
          log('ended')
          onEnded?.()
        }}
        onLoadedMetadata={(event) => {
          const video = event.currentTarget
          setDuration(video.duration)
          setVolume(video.volume)
          setIsMuted(video.muted)
          setPlaybackRate(video.playbackRate)
          setHasEnded(false)
          volumeBeforeCommitRef.current = video.volume

          const seekTarget = pendingSeekRef.current
          if (seekTarget !== null) {
            pendingSeekRef.current = null
            previousTimeRef.current = seekTarget
            if (seekTarget > 0) {
              suppressSeekLogRef.current = true
              video.currentTime = seekTarget
              setCurrentTime(seekTarget)
            }
          } else {
            previousTimeRef.current = 0
            setCurrentTime(0)
          }

          onLoadedMetadata?.()
        }}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => {
          const video = event.currentTarget
          setCurrentTime(video.currentTime)

          if (!isScrubbingRef.current) {
            previousTimeRef.current = video.currentTime
          }
        }}
        onSeeking={(event) => {
          const nextTime = event.currentTarget.currentTime

          if (suppressSeekLogRef.current) {
            suppressSeekLogRef.current = false
            previousTimeRef.current = nextTime
            return
          }

          if (isScrubbingRef.current) {
            return
          }

          logSeekDelta(nextTime)
        }}
        onProgress={(event) => {
          const video = event.currentTarget
          const ranges = video.buffered

          for (let index = 0; index < ranges.length; index += 1) {
            if (
              ranges.start(index) <= video.currentTime &&
              ranges.end(index) >= video.currentTime
            ) {
              setBufferedSeconds(ranges.end(index))
              return
            }
          }
        }}
        onVolumeChange={(event) => {
          setVolume(event.currentTarget.volume)
          setIsMuted(event.currentTarget.muted)
        }}
        onRateChange={(event) => setPlaybackRate(event.currentTarget.playbackRate)}
      >
        <source src={src} type="video/mp4" />
        {copy.video.unsupported}
      </video>

      {!isPlaying ? (
        <button
          type="button"
          className="video-player__overlay-button"
          aria-label={playLabel}
          onClick={togglePlay}
        >
          <span className="video-player__overlay-icon" aria-hidden="true">
            {hasEnded ? videoIcons.replay : videoIcons.play}
          </span>
        </button>
      ) : null}

      <div className="video-player__controls">
        <VideoScrubber
          currentTime={currentTime}
          duration={duration}
          bufferedSeconds={bufferedSeconds}
          chapters={markedChapters}
          showChapterTitles={activeFeatures.chapterLabels}
          allowChapterJump={activeFeatures.chapterNavigation}
          onSeek={seekTo}
          onScrubStart={() => {
            isScrubbingRef.current = true
          }}
          onScrubEnd={() => {
            isScrubbingRef.current = false
            const video = videoRef.current
            if (video) {
              logSeekDelta(video.currentTime)
            }
          }}
          onChapterJump={(chapter) => {
            log('chapter_selected', {
              chapterIndex: chapter.index + 1,
              chapterTitle: chapter.title,
              toSeconds: Math.round(chapter.startSeconds),
            })
          }}
        />

        <div className="video-player__bar">
          <button
            type="button"
            className="video-player__button"
            aria-label={playLabel}
            onClick={togglePlay}
          >
            {playIcon}
          </button>

          <div className="video-player__volume">
            <button
              type="button"
              className="video-player__button"
              aria-label={isMuted || volume === 0 ? labels.unmute : labels.mute}
              onClick={toggleMute}
            >
              {isMuted || volume === 0 ? videoIcons.volumeMuted : videoIcons.volume}
            </button>

            <input
              type="range"
              className="video-player__volume-slider"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              aria-label={labels.volume}
              onChange={(event) => changeVolume(Number(event.target.value))}
              onPointerUp={commitVolume}
              onKeyUp={commitVolume}
              onBlur={commitVolume}
            />
          </div>

          <p className="video-player__time">
            <span>{formatDuration(currentTime)}</span>
            <span className="video-player__time-separator" aria-hidden="true">
              /
            </span>
            <span>{formatDuration(duration)}</span>
          </p>

          {currentChapter ? (
            <p className="video-player__chapter" aria-live="polite">
              <span className="video-player__chapter-label">{labels.chapter}</span>
              <span className="video-player__chapter-title">{currentChapter.title}</span>
            </p>
          ) : null}

          <div className="video-player__spacer" />

          {activeFeatures.playbackSpeed ? (
            <div className="video-player__speed" ref={speedMenuRef}>
              <button
                type="button"
                className="video-player__button video-player__button--speed"
                aria-label={labels.speed}
                aria-haspopup="true"
                aria-expanded={isSpeedMenuOpen}
                onClick={() => setIsSpeedMenuOpen((open) => !open)}
              >
                <span className="video-player__speed-value">
                  {labels.speedOption(playbackRate)}
                </span>
              </button>

              {isSpeedMenuOpen ? (
                <div className="video-player__speed-menu" role="menu" aria-label={labels.speed}>
                  {PLAYBACK_RATES.map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      role="menuitemradio"
                      aria-checked={playbackRate === rate}
                      className={[
                        'video-player__speed-option',
                        playbackRate === rate ? 'video-player__speed-option--active' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => changePlaybackRate(rate)}
                    >
                      {labels.speedOption(rate)}
                      {rate === 1 ? (
                        <span className="video-player__speed-note">{labels.normalSpeedSuffix}</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          <button
            type="button"
            className="video-player__button"
            aria-label={isFullscreen ? labels.exitFullscreen : labels.enterFullscreen}
            onClick={toggleFullscreen}
          >
            {isFullscreen ? videoIcons.fullscreenExit : videoIcons.fullscreen}
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudyVideoPlayer
