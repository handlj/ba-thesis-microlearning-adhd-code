export type GroupAssignment = 'control' | 'experimental'

export type DemographicAnswers = {
  age: string
  studyBackground: string
  adhdDiagnosis: string
}

function stableSerialize(data: Record<string, string>): string {
  return Object.keys(data)
    .sort()
    .map((key) => `${key}:${data[key]}`)
    .join('|')
}

function hashDjb2(value: string): number {
  let hash = 5381
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index)
  }
  return hash >>> 0
}

export function assignDeterministicGroup(
  demographics: DemographicAnswers,
): GroupAssignment {
  const serialized = stableSerialize(demographics)
  return hashDjb2(serialized) % 2 === 0 ? 'control' : 'experimental'
}
