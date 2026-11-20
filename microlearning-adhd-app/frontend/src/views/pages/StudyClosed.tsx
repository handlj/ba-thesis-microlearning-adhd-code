import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import { studyClosedCopy } from '@content/pages/studyClosed.ts'

function StudyClosed() {
  return (
    <StudyPage variant="landing">
      <StudyHeading {...studyClosedCopy.heading} />
    </StudyPage>
  )
}

export default StudyClosed
