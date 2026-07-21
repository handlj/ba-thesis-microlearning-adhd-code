/*
  Chapter markers for the experimental-group videos, shown as segments in the
  player's progress bar (the YouTube treatment).

  Chapters are content, not data the backend knows about, so they live here
  next to the quiz questions and their `videoTimestamp` values in quiz.ts.

  The keys are the video ids the backend hands out in /experimental-videos,
  currently `experimental-video-1` .. `experimental-video-4` (see
  NUMBER_OF_EXPERIMENTAL_VIDEOS in backend/app/config.py).

  A video with no entry, or with an empty list, renders an unsegmented
  progress bar. That is deliberately the case for the control-group video and
  the instruction video on the ready page, which never receive chapters.

  To add chapters, list them in ascending order of `startSeconds`. The first
  chapter should start at 0 so the bar has no unlabelled leading gap; a chapter
  runs until the next one starts, and the last one until the video ends.
*/

export type VideoChapter = {
  /* Where the chapter starts, in seconds from the beginning of the video. */
  startSeconds: number
  /* Short header, shown in the scrubber tooltip and as the current-chapter label. */
  title: string
}

export const experimentalVideoChapters: Record<string, readonly VideoChapter[]> = {
  // TODO: Fill in the chapter timestamps and headers per video.
  // Example:
  // 'experimental-video-1': [
  //   { startSeconds: 0, title: 'Einführung' },
  //   { startSeconds: 41, title: 'Variablen zuweisen' },
  //   { startSeconds: 137, title: 'Rechenoperatoren' },
  // ],
  'experimental-video-1': [],
  'experimental-video-2': [],
  'experimental-video-3': [],
  'experimental-video-4': [],
}

/*
  Chapters for one video, normalised for the player: sorted, clamped to
  non-negative starts, and empty when the video has none.
*/
export function getVideoChapters(videoId: string | null | undefined): readonly VideoChapter[] {
  if (!videoId) {
    return []
  }

  const chapters = experimentalVideoChapters[videoId] ?? []

  return [...chapters]
    .map((chapter) => ({ ...chapter, startSeconds: Math.max(0, chapter.startSeconds) }))
    .sort((first, second) => first.startSeconds - second.startSeconds)
}
