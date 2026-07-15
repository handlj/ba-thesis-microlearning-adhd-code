import { icons } from './icons.tsx'

export type StudyFact = {
  icon: string
  label: string
  value: string
}

type StudyFactsProps = {
  facts: readonly StudyFact[]
}

function StudyFacts({ facts }: StudyFactsProps) {
  return (
    <div className="study-facts">
      {facts.map((fact) => (
        <div  key={fact.label}
              className="study-fact">
          <div className="study-fact__header">
            <span className="study-fact__icon"
                  aria-hidden="true">
              {icons[fact.icon]}
            </span>

            <p className="study-fact__label">
              {fact.label}
            </p>
          </div>

          <p className="study-fact__value">
            {fact.value}
          </p>
        </div>
      ))}
    </div>
  )
}

export default StudyFacts
