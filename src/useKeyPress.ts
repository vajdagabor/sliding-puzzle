import { useEffect } from 'react'

export function useKeyPress(handler: (event: KeyboardEvent) => void) {
  useEffect(() => {
    globalThis.addEventListener('keydown', handler)

    return () => globalThis.removeEventListener('keydown', handler)
  }, [])
}
