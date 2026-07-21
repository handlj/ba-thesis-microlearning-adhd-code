import { useRef, useState } from 'react'
import { copy } from '../../content/copy.ts'
import type { VideoChapter } from '../../content/videoChapters.ts'
import { buildSegments, type ChapterSegment } from './chapterSegments.ts'
import { describeDuration, formatDuration } from './formatDuration.ts'

/*
  The progress bar of the study video player.

  Without chapters it is a single track, which is what the control group and
  the instruction video get. With chapters it is split into one segment per
  chapter, separated by small gaps, the way YouTube marks them — a segment is
  laid out in proportion to how long its chapter runs, and fills independently.

  Chapters are only ever passed in for the experimental group; see
  utils/videoFeatures.ts for how the three chapter features are gated.
*/

type VideoScrubberProps = {
  currentTime: number
  duration: number
  bufferedSeconds: number
  chapters: readonly VideoChapter[]
  /* Name the chapter in the tooltip. Off unless the chapterLabels feature is on. */
  showChapterTitles: boolean
  /* Turn a click on a segment into a jump to that chapter's start. */
  allowChapterJump: boolean
  onSeek: (seconds: number) => void
  onScrubStart: () => void
  onScrubEnd: () => void
  onChapterJump: (chapter: { index: number; title: string; startSeconds: number }) => void
}

/* How far the pointer may travel before a click counts as a drag instead. */
const DRAG_THRESHOLD_PIXELS = 3

const KEYBOARD_SEEK_SECONDS = 5

function clampRatio(value: number): number {
  return Math.min(1, Math.max(0, value))
}

function VideoScrubber({
  currentTime,
  duration,
  bufferedSeconds,
  chapters,
  showChapterTitles,
  allowChapterJump,
  onSeek,
  onScrubStart,
  onScrubEnd,
  onChapterJump,
}: VideoScrubberProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const pointerOriginRef = useRef<{ x: number; y: number } | null>(null)
  const didDragRef = useRef(false)
  const [isScrubbing, setIsScrubbing] = useState(false)
  const [hoverRatio, setHoverRatio] = useState<number | null>(null)

  const labels = copy.video.player
  const hasDuration = Number.isFinite(duration) && duration > 0
  const playedRatio = hasDuration ? clampRatio(currentTime / duration) : 0
  const segments = buildSegments(chapters, duration)

  const ratioFromEvent = (clientX: number): number => {
    const track = trackRef.current
    if (!track) {
      return 0
    }

    const bounds = track.getBoundingClientRect()
    if (bounds.width === 0) {
      return 0
    }

    return clampRatio((clientX - bounds.left) / bounds.width)
  }

  const segmentAtRatio = (ratio: number): { index: number; segment: ChapterSegment } | null => {
    if (!hasDuration || segments.length === 0) {
      return null
    }

    const seconds = ratio * duration
    const index = segments.findIndex(
      (segment) => seconds >= segment.startSeconds && seconds < segment.endSeconds,
    )
    const resolvedIndex = index === -1 ? segments.length - 1 : index

    return { index: resolvedIndex, segment: segments[resolvedIndex] }
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!hasDuration || event.button !== 0) {
      return
    }

    event.currentTarget.setPointerCapture(event.pointerId)
    pointerOriginRef.current = { x: event.clientX, y: event.clientY }
    didDragRef.current = false
    setIsScrubbing(true)
    onScrubStart()

    // With chapter jumping on, where a click lands is only decided on release:
    // a click means "go to this chapter", a drag means "scrub freely". Seeking
    // to the pointer straight away would make every chapter jump look like two
    // separate seeks to the participant and in the interaction log.
    if (!allowChapterJump) {
      onSeek(ratioFromEvent(event.clientX) * duration)
    }
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const ratio = ratioFromEvent(event.clientX)
    setHoverRatio(ratio)

    if (!isScrubbing || !hasDuration) {
      return
    }

    const origin = pointerOriginRef.current
    if (origin && !didDragRef.current) {
      const travelled = Math.hypot(event.clientX - origin.x, event.clientY - origin.y)
      if (travelled > DRAG_THRESHOLD_PIXELS) {
        didDragRef.current = true
      }
    }

    if (didDragRef.current || !allowChapterJump) {
      onSeek(ratio * duration)
    }
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isScrubbing) {
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    if (hasDuration && allowChapterJump && !didDragRef.current) {
      const ratio = ratioFromEvent(event.clientX)
      const hit = segmentAtRatio(ratio)

      if (hit) {
        onSeek(hit.segment.startSeconds)
        onChapterJump({
          index: hit.index,
          title: hit.segment.title,
          startSeconds: hit.segment.startSeconds,
        })
      } else {
        onSeek(ratio * duration)
      }
    }

    pointerOriginRef.current = null
    didDragRef.current = false
    setIsScrubbing(false)
    onScrubEnd()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!hasDuration) {
      return
    }

    const seekTo = (seconds: number) => {
      event.preventDefault()
      onSeek(Math.min(duration, Math.max(0, seconds)))
    }

    if (event.key === 'ArrowLeft') seekTo(currentTime - KEYBOARD_SEEK_SECONDS)
    if (event.key === 'ArrowRight') seekTo(currentTime + KEYBOARD_SEEK_SECONDS)
    if (event.key === 'Home') seekTo(0)
    if (event.key === 'End') seekTo(duration)
  }

  const hoverSeconds = hoverRatio !== null && hasDuration ? hoverRatio * duration : null
  const hoverChapter = hoverRatio !== null ? segmentAtRatio(hoverRatio) : null
  const showTooltip = hoverSeconds !== null

  const renderSegment = (
    key: string,
    startSeconds: number,
    endSeconds: number,
    flexBasis: number,
    title?: string,
  ) => {
    const span = endSeconds - startSeconds
    const fill = span > 0 ? clampRatio((currentTime - startSeconds) / span) : 0
    const buffered = span > 0 ? clampRatio((bufferedSeconds - startSeconds) / span) : 0

    return (
      <div key={key}
           className="video-scrubber__segment"
           style={{ flexGrow: flexBasis }}
           title={title}>
        <span className="video-scrubber__buffered"
              style={{ transform: `scaleX(${buffered})` }} />
        <span className="video-scrubber__played"
              style={{ transform: `scaleX(${fill})` }} />
      </div>
    )
  }

  return (
    <div className="video-scrubber__row">
      {showTooltip ? (
        <div className="video-scrubber__tooltip"
             style={{ left: `${(hoverRatio ?? 0) * 100}%` }}
             aria-hidden="true">
          {showChapterTitles && hoverChapter ? (
            <span className="video-scrubber__tooltip-title">
              {hoverChapter.segment.title}
            </span>
          ) : null}

          <span className="video-scrubber__tooltip-time">
            {formatDuration(hoverSeconds ?? 0)}
          </span>
        </div>
      ) : null}

      <div
        ref={trackRef}
        className={[
          'video-scrubber',
          isScrubbing ? 'video-scrubber--scrubbing' : '',
          allowChapterJump && segments.length > 0 ? 'video-scrubber--chapters-clickable' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        role="slider"
        tabIndex={0}
        aria-label={labels.seekSlider}
        aria-valuemin={0}
        aria-valuemax={Math.max(0, Math.round(duration))}
        aria-valuenow={Math.round(currentTime)}
        aria-valuetext={labels.elapsedOfTotal(
          describeDuration(currentTime),
          describeDuration(duration),
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={() => setHoverRatio(null)}
        onKeyDown={handleKeyDown}
      >
        <div className="video-scrubber__track">
          {segments.length > 0
            ? segments.map((segment, index) =>
                renderSegment(
                  `${index}-${segment.startSeconds}`,
                  segment.startSeconds,
                  segment.endSeconds,
                  segment.endSeconds - segment.startSeconds,
                  showChapterTitles ? segment.title : undefined,
                ),
              )
            : renderSegment('single', 0, hasDuration ? duration : 1, 1)}
        </div>

        <span className="video-scrubber__thumb"
              style={{ left: `${playedRatio * 100}%` }}
              aria-hidden="true" />
      </div>
    </div>
  )
}

export default VideoScrubber
