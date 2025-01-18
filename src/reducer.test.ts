import { describe, it, expect } from 'vitest'
import { State, reducer } from './reducer'
import { Field } from './model'

const baseState: State = {
  size: 3,
  fields: [],
  fieldRotations: new Map([
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0],
    [7, 0],
    [8, 0],
  ]),
  playerDirection: 'down',
}

describe('KEYDOWN', () => {
  it('should return the same state when null is at the bottom', () => {
    const fields: Field[] = [1, 2, 3, 4, 5, 6, 7, 8, null]
    const state = { ...baseState, fields }
    const result = reducer(state, { type: 'KEYDOWN', rotation: 0 })
    const expected = { ...state }

    expect(result).toEqual(expected)
  })

  it('should change the player orientation', () => {
    const fields: Field[] = [1, 2, 3, 4, 5, 6, 7, 8, null]
    const state: State = { ...baseState, fields, playerDirection: 'up' }
    const result = reducer(state, { type: 'KEYDOWN', rotation: 0 })
    const expected = { ...state, playerDirection: 'down' }

    expect(result).toEqual(expected)
  })

  it('should move the player down', () => {
    const fields: Field[] = [1, 2, 3, 4, 5, null, 6, 7, 8]
    const state: State = { ...baseState, fields }
    const result = reducer(state, { type: 'KEYDOWN', rotation: 0 })
    const expected = { ...state, fields: [1, 2, 3, 4, 5, 8, 6, 7, null] }

    expect(result).toEqual(expected)
  })
})
