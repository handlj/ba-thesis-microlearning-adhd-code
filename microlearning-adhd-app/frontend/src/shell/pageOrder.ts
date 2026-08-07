export const PAGE_ORDER = [
  'welcome',
  'consent',
  'demographics',
  'adhdScreening',
  'prePanas',
  'ready',
  'fam',
  'preQuiz',
  'control',
  'experimental',
  'postPanas',
  'ues',
  'followUp',
  'feedback',
  'thankYou',
] as const

export type Page = (typeof PAGE_ORDER)[number]

const NEXT_OVERRIDES: Partial<Record<Page, Page | null>> = {
  preQuiz: null,
  control: 'postPanas',
  experimental: 'postPanas',
  followUp: null,
  thankYou: null,
}

const BACKTRACKABLE_PAGE = new Set<Page>(['consent', 'demographics'])

export function nextPage(currentPage: Page): Page | null {
  if (Object.hasOwn(NEXT_OVERRIDES, currentPage)) {
    return NEXT_OVERRIDES[currentPage] ?? null
  }

  return PAGE_ORDER[PAGE_ORDER.indexOf(currentPage) + 1] ?? null
}

export function previousPage(currentPage: Page): Page | null {
  if (!BACKTRACKABLE_PAGE.has(currentPage)) {
    return null
  }

  return PAGE_ORDER[PAGE_ORDER.indexOf(currentPage) - 1] ?? null
}
