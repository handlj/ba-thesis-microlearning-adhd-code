import StudyActions from '../../components/StudyActions.tsx'
import StudyFacts from '../../components/StudyFacts.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import { icons } from '../../components/icons.tsx'
import { copy } from '../../content/copy.ts'

type ThankYouProps = {
  onReturnToStart: () => void
}

function ThankYou({ onReturnToStart }: ThankYouProps) {
  return (
    <StudyPage  ariaLabelledBy="thank-you-title"
                cardClassName="study-card--ready">
      <StudyHeading
        eyebrow={copy.thankYou.heading.eyebrow}
        title={copy.thankYou.heading.title}
        intro={copy.thankYou.heading.intro}
        id="thank-you-title"
      />

      <StudyFacts facts={copy.thankYou.facts} />

      <div className="contact-card">
        <span className="contact-card__icon"
              aria-hidden="true">
          {icons.mail}
        </span>

        <div className="contact-card__body">
          <p className="contact-card__label">
            {copy.thankYou.contact.label}
          </p>

          <p className="contact-card__name">
            {copy.thankYou.contact.name}
          </p>

          <a  className="contact-card__link"
              href={`mailto:${copy.thankYou.contact.email}`}>
            {copy.thankYou.contact.email}
          </a>
        </div>
      </div>

      <StudyActions>
        <button type="button"
                className="start-button"
                onClick={onReturnToStart}>
          {copy.actions.returnToStart}
        </button>
      </StudyActions>
    </StudyPage>
  )
}

export default ThankYou
