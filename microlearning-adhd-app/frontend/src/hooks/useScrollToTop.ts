import { useLayoutEffect } from "react"

/*
  This hook is used to scroll the window to the top whenever the `key` changes.
 */
export function useScrollToTop(key: string) {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [key])
}
