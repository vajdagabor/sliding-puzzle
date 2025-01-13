export type Field = number | null
export type Pos = { x: number; y: number }
export type Direction = 'left' | 'right' | 'up' | 'down'

export function newFields(size: number): Field[] {
  const length = size ** 2

  function newField(_: any, i: number): Field {
    return i === length - 1 ? null : i + 1
  }

  return Array.from({ length }, newField)
}

export function newFieldsShuffled(size: number): Field[] {
  return shuffle(newFields(size))
}

function isNumberArray(arr: Field[]): arr is number[] {
  return arr.every(v => typeof v === 'number')
}

export function isSorted(fs: Field[]) {
  const fields = fs.slice(0, fs.length - 1)
  if (!isNumberArray(fields)) return false

  return fields.every((v, i, arr) => i === 0 || arr[i - 1] <= v)
}

type PosOf = (index: number, size: number) => Pos
export const posOf: PosOf = (index, size) => {
  return { x: index % size, y: Math.floor(index / size) }
}

type IndexOf = (pos: Pos, size: number) => number
export const indexOf: IndexOf = (pos, size) => pos.y * size + pos.x

const isSameRow = (p1: Pos, p2: Pos) => p1.y === p2.y
const isSameCol = (p1: Pos, p2: Pos) => p1.x === p2.x
const areAdjacentLines = (p1: Pos, p2: Pos) => Math.abs(p1.y - p2.y) === 1
const areAdjacentCols = (p1: Pos, p2: Pos) => Math.abs(p1.x - p2.x) === 1

type CanMove = (index: number, size: number, fields: Field[]) => boolean
export const canMove: CanMove = (index, size, fields) => {
  const gap = posOf(findNullIndex(fields), size)
  const p = posOf(index, size)

  return (
    (isSameCol(gap, p) && areAdjacentLines(gap, p)) || // horizontal
    (isSameRow(gap, p) && areAdjacentCols(gap, p)) // vertical
  )
}

type Move = (index: number, size: number, fields: Field[]) => Field[]
export const move: Move = (index, size, fields) => {
  if (!canMove(index, size, fields)) return fields

  return swapWithNull(index, fields)
}

export function moveEmpty(
  dir: Direction,
  size: number,
  fields: Field[]
): Field[] {
  const nullPos = findNullPos(size, fields)

  const moveConfig: Record<Direction, { axis: 'x' | 'y'; delta: 1 | -1 }> = {
    left: { axis: 'x', delta: -1 },
    right: { axis: 'x', delta: 1 },
    up: { axis: 'y', delta: -1 },
    down: { axis: 'y', delta: 1 },
  }
  const config = moveConfig[dir]
  const edgeIndex = config.delta === 1 ? size - 1 : 0

  if (nullPos[config.axis] === edgeIndex) return fields

  const piecePos = {...nullPos, [config.axis]: nullPos[config.axis] + config.delta}
  const pieceIndex = indexOf(piecePos, size)
  const nullIndex = indexOf(nullPos, size)

  return swap(nullIndex, pieceIndex, fields)
}

export function swap(index1: number, index2: number, fields: Field[]): Field[] {
  const fs = [...fields]
  ;[fields[index1], fields[index2]] = [fields[index2], fields[index1]]

  return fs
}

export function swapWithNull(index: number, fields: Field[]): Field[] {
  const fs = [...fields]
  const nullIndex = findNullIndex(fs)
  ;[fs[nullIndex], fs[index]] = [fs[index], fs[nullIndex]]

  return fs
}

export function findNullIndex(fields: Field[]): number {
  return fields.findIndex(f => f === null)
}

export function findNullPos(size: number, fields: Field[]): Pos {
  const nullIndex = findNullIndex(fields)
  return posOf(nullIndex, size)
}

export function random(max: number): number {
  return Math.floor(Math.random() * (max + 1))
}

export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  const l = result.length

  for (let i = 0; i < l; i++) {
    const j = random(l - 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}
