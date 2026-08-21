export type VideoChapter = {
  startSeconds: number
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

export function getVideoChapters(videoId: string | null | undefined): readonly VideoChapter[] {
  if (!videoId) {
    return []
  }

  const chapters = experimentalVideoChapters[videoId] ?? []

  return [...chapters]
    .map((chapter) => ({ ...chapter, startSeconds: Math.max(0, chapter.startSeconds) }))
    .sort((first, second) => first.startSeconds - second.startSeconds)
}

export function findChapterFromTimestamp(
  chapters: readonly VideoChapter[],
  seconds: number,
): VideoChapter | null {
  let match: VideoChapter | null = null

  for (const chapter of chapters) {
    if (chapter.startSeconds > seconds) break
    match = chapter
  }

  return match
}
