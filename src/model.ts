export type Field = number | null
export type Pos = { x: number; y: number }

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
  const fields = fs.slice(0,fs.length - 1)
  if (!isNumberArray(fields)) return false

  return fields.every((v, i, arr) => i === 0 || arr[i - 1] <= v)
}

type PosOf = (index: number, size: number) => Pos
export const posOf: PosOf = (index, size) => {
  return { x: index % size, y: Math.floor(index / size) }
}

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
  const fs = [...fields]
  if (!canMove(index, size, fields)) return fs

  const nullIndex = findNullIndex(fs)
  ;[fs[nullIndex], fs[index]] = [fs[index], fs[nullIndex]]
  return fs
}

export function findNullIndex(fields: Field[]): number {
  return fields.findIndex(f => f === null)
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
