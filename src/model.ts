import { Direction, Field, FieldRotationMap, Pos } from './types'
import { maxRotation } from './config'

const moveConfig: Record<Direction, { axis: 'x' | 'y'; delta: 1 | -1 }> = {
  left: { axis: 'x', delta: -1 },
  right: { axis: 'x', delta: 1 },
  up: { axis: 'y', delta: -1 },
  down: { axis: 'y', delta: 1 },
}

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

export function makeFieldRotations(fields: Field[]): FieldRotationMap {
  return fields.reduce((map, value, index) => {
    if (value === null) return map
    if (isCorrect(index, value)) return map

    map.set(value, newFieldRotation(index, value))

    return map
  }, new Map())
}

export function newFieldRotation(index: number, value: Field): number {
  if (value === null) return 0
  if (isCorrect(index, value)) return 0

  return randomAngle()
}

export function randomAngle() {
  return Math.random() * maxRotation * 2 - maxRotation
}

export function isCorrect(index: number, value: Field) {
  if (typeof value === 'number' && index === value - 1) return true
  if (value === null) return true

  return false
}

export function isSorted(fs: Field[]) {
  const fields = fs.slice(0, fs.length - 1)
  if (!isNumberArray(fields)) return false

  return fields.every((v, i, arr) => i === 0 || arr[i - 1] <= v)
}

export function posOf(index: number, size: number): Pos {
  return { x: index % size, y: Math.floor(index / size) }
}

export function indexOf(pos: Pos, size: number): number {
  return pos.y * size + pos.x
}

export function valueOf(pos: Pos, size: number, fields: Field[]): Field {
  return fields[indexOf(pos, size)]
}

const isSameRow = (p1: Pos, p2: Pos) => p1.y === p2.y
const isSameCol = (p1: Pos, p2: Pos) => p1.x === p2.x
const areAdjacentLines = (p1: Pos, p2: Pos) => Math.abs(p1.y - p2.y) === 1
const areAdjacentCols = (p1: Pos, p2: Pos) => Math.abs(p1.x - p2.x) === 1

export function canMove(index: number, size: number, fields: Field[]): boolean {
  const gap = posOf(findNullIndex(fields), size)
  const p = posOf(index, size)

  return (
    (isSameCol(gap, p) && areAdjacentLines(gap, p)) || // horizontal
    (isSameRow(gap, p) && areAdjacentCols(gap, p)) // vertical
  )
}

export function directionFromEmpty(
  index: number,
  size: number,
  fields: Field[]
): Direction | undefined {
  const pos = posOf(index, size)

  if (valueOf({ ...pos, x: pos.x - 1 }, size, fields) === null) return 'right'
  if (valueOf({ ...pos, x: pos.x + 1 }, size, fields) === null) return 'left'
  if (valueOf({ ...pos, y: pos.y - 1 }, size, fields) === null) return 'down'
  if (valueOf({ ...pos, y: pos.y + 1 }, size, fields) === null) return 'up'

  return undefined
}

export function movePiece(
  index: number,
  size: number,
  fields: Field[]
): Field[] {
  const direction = directionFromEmpty(index, size, fields)
  if (direction === undefined) return fields

  return moveEmpty(direction, size, fields)
}

export function moveEmpty(
  dir: Direction,
  size: number,
  fields: Field[]
): Field[] {
  const pieceIndex = getAdjacentIndex(dir, size, fields)
  if (pieceIndex === undefined) return fields

  const nullPos = findNullPos(size, fields)
  const nullIndex = indexOf(nullPos, size)

  return swap(nullIndex, pieceIndex, fields)
}

export function getAdjacentIndex(
  dir: Direction,
  size: number,
  fields: Field[]
): number | undefined {
  const config = moveConfig[dir]
  const edgeIndex = config.delta === 1 ? size - 1 : 0
  const nullPos = findNullPos(size, fields)

  if (nullPos[config.axis] === edgeIndex) return undefined

  const piecePos = {
    ...nullPos,
    [config.axis]: nullPos[config.axis] + config.delta,
  }

  return indexOf(piecePos, size)
}

export function swap(index1: number, index2: number, fields: Field[]): Field[] {
  const fs = [...fields]
  ;[fs[index1], fs[index2]] = [fs[index2], fs[index1]]

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
