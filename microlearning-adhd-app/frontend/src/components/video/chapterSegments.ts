import type { VideoChapter } from '../../content/videoChapters.ts'

/*
  A chapter with its end resolved: a chapter runs until the next one starts,
  and the last one until the video ends. Shared by the scrubber, which lays the
  segments out, and the player, which names the one currently playing.
*/
export type ChapterSegment = {
  title: string
  startSeconds: number
  endSeconds: number
}

export function buildSegments(
  chapters: readonly VideoChapter[],
  duration: number,
): ChapterSegment[] {
  if (chapters.length === 0 || !Number.isFinite(duration) || duration <= 0) {
    return []
  }

  // A chapter starting past the end of the video would lay out as a zero-width
  // segment, so drop those rather than render slivers.
  const usable = chapters.filter((chapter) => chapter.startSeconds < duration)

  return usable.map((chapter, index) => ({
    title: chapter.title,
    startSeconds: chapter.startSeconds,
    endSeconds: usable[index + 1]?.startSeconds ?? duration,
  }))
}
