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
