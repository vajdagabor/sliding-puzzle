export type Pos = { x: number; y: number }
export type Direction = 'up' | 'right' | 'down' | 'left'
export type Field = number | null
export type FieldRotationMap = Map<Field, number>

export const directions: Direction[] = ['up', 'right', 'down', 'left']
