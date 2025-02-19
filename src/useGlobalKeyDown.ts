import { useEffect } from 'react'

export function useGlobalKeyDown(handler: (event: KeyboardEvent) => void) {
  useEffect(() => {
    globalThis.addEventListener('keydown', handler)

    return () => globalThis.removeEventListener('keydown', handler)
  }, [])
}
