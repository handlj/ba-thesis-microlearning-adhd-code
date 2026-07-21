/*
  Clock time for the player: m:ss, or h:mm:ss once a video runs an hour or
  longer. Non-finite input (before metadata has loaded) reads as 0:00.
*/
export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return '0:00'
  }

  const rounded = Math.floor(totalSeconds)
  const hours = Math.floor(rounded / 3600)
  const minutes = Math.floor((rounded % 3600) / 60)
  const seconds = rounded % 60
  const paddedSeconds = String(seconds).padStart(2, '0')

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${paddedSeconds}`
  }

  return `${minutes}:${paddedSeconds}`
}

/*
  Spoken form for screen readers, so the slider does not read "3:07" as a
  ratio. German, matching the rest of the interface copy.
*/
export function describeDuration(totalSeconds: number): string {
  const rounded = Math.max(0, Math.floor(Number.isFinite(totalSeconds) ? totalSeconds : 0))
  const minutes = Math.floor(rounded / 60)
  const seconds = rounded % 60
  const minutePart = minutes === 1 ? '1 Minute' : `${minutes} Minuten`
  const secondPart = seconds === 1 ? '1 Sekunde' : `${seconds} Sekunden`

  return minutes > 0 ? `${minutePart} ${secondPart}` : secondPart
}
