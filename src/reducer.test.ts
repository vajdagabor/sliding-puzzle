import { describe, it, expect } from 'vitest'
import { State, reducer } from './reducer'
import { Field } from './model'

const baseState: State = {
  size: 3,
  fields: [],
  fieldRotations: new Map(),
  playerDirection: 'down',
}

describe('KEYDOWN', () => {
  it('should return the same state when null is at the bottom', () => {
    const fields: Field[] = [1, 2, 3, 4, 5, 6, 7, 8, null]
    const state = { ...baseState, fields }
    const result = reducer(state, { type: 'KEYDOWN' })
    const expected = { ...state }

    expect(result).toEqual(expected)
  })

  it('should change the player orientation', () => {
    const fields: Field[] = [1, 2, 3, 4, 5, 6, 7, 8, null]
    const state: State = { ...baseState, fields, playerDirection: 'up' }
    const result = reducer(state, { type: 'KEYDOWN' })
    const expected = { ...state, playerDirection: 'down' }

    expect(result).toEqual(expected)
  })

  it('should move the player down', () => {
    const fields: Field[] = [1, 2, 3, 4, 5, null, 7, 8, 9]
    const state: State = { ...baseState, fields }
    const result = reducer(state, { type: 'KEYDOWN' })
    const expected = { ...state, fields: [1, 2, 3, 4, 5, 9, 7, 8, null] }

    expect(result).toEqual(expected)
  })
})
