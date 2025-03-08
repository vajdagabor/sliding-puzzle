export const minSize = 2
export const maxSize = 7
export const initialSize = 4
export const maxRotation = 5 // degrees
export const shuffleDelay = 1 // ms

export const sizes = Array.from(
  { length: maxSize - minSize + 1 },
  (_, i) => i + minSize
)
