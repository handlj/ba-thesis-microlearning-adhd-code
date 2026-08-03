import axios from 'axios'
import { useEffect, useState } from 'react'
import { copy } from '../content/copy.ts'

export function useAsyncResource<T>(
  fetcher: () => Promise<T>,
  fallbackMessage: string,
) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadResource = async () => {
      try {
        setIsLoading(true)
        const response = await fetcher()

        if (!active) {
          return
        }

        setData(response)
        setError(null)
      } catch (requestError) {
        if (!active) {
          return
        }

        const message = axios.isAxiosError(requestError) && requestError.code === 'ECONNABORTED'
          ? copy.errors.timeout
          : requestError instanceof Error
            ? requestError.message
            : fallbackMessage

        setError(message)
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    void loadResource()

    return () => {
      active = false
    }
  }, [fetcher, fallbackMessage])

  return { data, isLoading, error }
}