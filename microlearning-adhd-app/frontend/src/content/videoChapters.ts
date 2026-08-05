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
  'experimental-video-1': [
    { startSeconds: 0, title: 'Variablen' },
    { startSeconds: 42, title: 'Datentypen' },
    { startSeconds: 99, title: 'Ganzzahlen und Gleitkommazahlen' },
    { startSeconds: 157, title: 'Strings/Zeichenketten' },
    { startSeconds: 223, title: '"Slicing"' },
  ],
  'experimental-video-2': [
    { startSeconds: 0, title: 'If Statements' },
    { startSeconds: 55, title: 'If-Else Statements' },
    { startSeconds: 102, title: 'If-Elif-Else Statements' },
    { startSeconds: 158, title: 'Code Beispiele' },
  ],
  'experimental-video-3': [
    { startSeconds: 0, title: 'For-Loops: Basics' },
    { startSeconds: 45, title: 'For-Loops: Beispiele' },
    { startSeconds: 133, title: 'While-Loops: Basics' },
    { startSeconds: 175, title: 'While-Loops: User-Input' },
    { startSeconds: 226, title: 'While-Loops: Endlosschleifen' },
    { startSeconds: 265, title: 'Loops: Keywords' },
  ],
  'experimental-video-4': [
    { startSeconds: 0, title: 'Funktionen: Grundkonzept' },
    { startSeconds: 58, title: 'Beispiele' },
    { startSeconds: 127, title: 'Funktionen: Definition' },
    { startSeconds: 179, title: 'Weitere Beispiele' },
    { startSeconds: 220, title: 'Valide Funktionsaufrufe' },
    { startSeconds: 270, title: 'Fehlerhafte Funktionsaufrufe' },
  ],
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
