import { describe, it, test, expect } from 'vitest'
import {
  canMove,
  newFields,
  newFieldsShuffled,
  posOf,
} from './model'

describe('newFieldsSorted()', () => {
  it('should create a single-cell board, with a single null field', () => {
    const board = newFields(1)
    const expected = [null]

    expect(board).toEqual(expected)
  })

  it('should create a four-cell board, filled with sorted fields', () => {
    const board = newFields(2)
    const expected = [1, 2, 3, null]

    expect(board).toEqual(expected)
  })
})

describe('newFieldsShuffled()', () => {
  it('should create an array with the length of size * size', () => {
    const board = newFieldsShuffled(3)
    expect(board.length).toBe(9)
  })

  test('the returned array should contain all the fields', () => {
    const board = newFieldsShuffled(3)
    const sorted = board.toSorted((a, b) =>
      a === null ? 1 : b === null ? -1 : a - b
    )
    const expected = newFields(3)

    expect(sorted).toEqual(expected)
  })
})

describe('posOf()', () => {
  test.each([
    [0, 2, { x: 0, y: 0 }],
    [1, 2, { x: 1, y: 0 }],
    [2, 2, { x: 0, y: 1 }],
    [3, 2, { x: 1, y: 1 }],
    [0, 3, { x: 0, y: 0 }],
    [1, 3, { x: 1, y: 0 }],
    [2, 3, { x: 2, y: 0 }],
    [3, 3, { x: 0, y: 1 }],
    [4, 3, { x: 1, y: 1 }],
    [5, 3, { x: 2, y: 1 }],
    [6, 3, { x: 0, y: 2 }],
    [7, 3, { x: 1, y: 2 }],
    [8, 3, { x: 2, y: 2 }],
  ])('when index=%i and size=%i it should return %o', (i, s, expected) => {
    const result = posOf(i, s)
    expect(result).toEqual(expected)
  })
})

describe('canMove()', () => {
  it.each`
    i    | s    | fields                            | expected | desc
    ${4} | ${3} | ${[0, null, 2, 3, 4, 5, 6, 7, 8]} | ${true}  | ${'4 can move up'}
    ${4} | ${3} | ${[0, 1, 2, 3, 4, 5, 6, null, 8]} | ${true}  | ${'4 can move down'}
    ${4} | ${3} | ${[0, 1, 2, null, 4, 5, 6, 7, 8]} | ${true}  | ${'4 can move left'}
    ${4} | ${3} | ${[0, 1, 2, 3, 4, null, 6, 7, 8]} | ${true}  | ${'4 can move right'}
    ${0} | ${3} | ${[0, 1, 2, null, 4, 5, 6, 7, 8]} | ${true}  | ${'0 can move down'}
    ${1} | ${3} | ${[0, 1, 2, 3, null, 5, 6, 7, 8]} | ${true}  | ${'1 can move down'}
    ${2} | ${3} | ${[0, 1, 2, 3, 4, null, 6, 7, 8]} | ${true}  | ${'2 can move down'}
    ${0} | ${3} | ${[0, 1, 2, 3, 4, 5, 6, 7, null]} | ${false}  | ${'0 cannot move'}
    ${1} | ${3} | ${[0, 1, 2, 3, 4, 5, 6, 7, null]} | ${false}  | ${'1 cannot move'}
    ${2} | ${3} | ${[0, 1, 2, 3, 4, 5, 6, 7, null]} | ${false}  | ${'2 cannot move'}

  `(
    '$desc',
    ({ i, s, fields, expected }) => {
      const result = canMove(i, s, fields)
      expect(result).toBe(expected)
    }
  )
})
