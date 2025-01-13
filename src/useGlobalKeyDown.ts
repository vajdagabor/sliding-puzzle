import { useEffect } from 'react'

export function useGlobalKeyDown(handler: (event: KeyboardEvent) => void) {
  useEffect(() => {
    window.addEventListener('keydown', handler)

    return () => window.removeEventListener('keydown', handler)
  }, [])
}
