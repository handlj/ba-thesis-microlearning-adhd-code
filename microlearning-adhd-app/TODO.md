# Project TODO

## Next Up

### Questionnaires
- [ ] Aufmerksamkeitsvalidierung (Kreuzen Sie bei dieser Frage bitte die Zahl "X" an.)

### Intervention
- [ ] Nach jedem EG Video, 4/5 Fragen korrekt, sonst zurück auf ML mit spezfischen Subkategorien
  "Track" Element in HTML evtl. verwendbar

### Post-Intervention
- [ ] Option auf Feedback-Auswertung der Quizzes für EG und CG

### Interaction Patterns
- [ ] Data Analysis: Interaction Patterns: Korrelieren mit Engagement (Fragebogen UES), frequentistisch

### Backend
- [ ] Update Backend persistence for updated questions (post-study feedback)
- [ ] Populate the endpoint for the frontend to fetch global configuration values (e.g. valid study backgrounds, valid ADHD diagnoses, etc.) from the backend, so that they are not hardcoded and duplicated.
- [ ] Add dedicated prequiz endpoint to backend, so we can distinguish between prequiz and postquiz submissions in the database.

### Study Flow
- [ ] Add that reloading the page does not reset the progress of the user.
- [ ] Translate all buttons from proceed to fortfahren
- [ ] If the user changes from one page to the other, it should arrive at the top of the page and not the same position as before.
- [ ] Adapt study flow graph since prequiz was added, adhd screening was enlarged

## Before Deployment
- [ ] Remove the explicit group labels in the Ready page.

## Nice to have

### Videos
- [ ] Timer einfügen nachdem weitergegangen werden kann (?)
  Incentive für unkooperatives Verhalten?
- [ ] Add that the videos do not only get counted as watched if the user watches the whole video, but also if they watch a certain percentage/range of it (e.g. 80%).
- [ ] Add the functionality that the user can change the video speed (not only the volume)
- [ ] Add measurement for dezibel and speed of the video

### Study Flow
- [ ] Progress Indicator for the whole study
- [ ] Add back buttons on every page without loosing progress, so that users can navigate freely between pages.
- [ ] Add an "Are you sure" dialog if the user tries to return to welcome page or the session overview page, to prevent them from losing their progress.

### Data Analysis
- [ ] Exclude users who are very fast on the questionnaires (e.g. < 1s per question)>)

### Documentation
- [ ] Add a shared file for error message strings

### Maintenance
- [ ] Decouple monolithic copy.ts file
- [ ] Extract text content from Consent.tsx into dedicated file
