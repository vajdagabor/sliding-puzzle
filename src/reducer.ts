import { Direction, Field, FieldRotationMap } from './types'
import { sizes, initialSize } from './config'
import {
  moveEmpty,
  newFields,
  directionFromEmpty,
  getAdjacentIndex,
  randomAngle,
  randomValidDirection,
  shuffleSteps,
} from './model'

// ---------
// CONSTANTS
// ---------

const keyMap: Record<string, Direction> = {
  ArrowDown: 'down',
  ArrowUp: 'up',
  ArrowLeft: 'left',
  ArrowRight: 'right',
}

// -----
// TYPES
// -----

export type State = {
  size: number
  fields: Field[]
  fieldRotations: FieldRotationMap
  playerDirection: Direction
  isShuffling: boolean
  shuffleSteps: number
}

export type Action =
  | { type: 'NOTHING' }
  | { type: 'GROW_BUTTON_CLICKED' }
  | { type: 'SHRINK_BUTTON_CLICKED' }
  | { type: 'SHUFFLE_COMPLETED' }
  | { type: 'SHUFFLE_BUTTON_CLICKED' }
  | { type: 'SHUFFLE_MOVE_INITIATED'; direction: Direction; rotation: number }
  | { type: 'STOP_BUTTON_CLICKED' }
  | { type: 'PIECE_CLICKED'; index: number; rotation: number }
  | { type: 'KEY_ARROW_PRESSED'; direction: Direction; rotation: number }
  | { type: 'KEY_NUMERIC_PRESSED'; size: number }
  | { type: 'KEY_S_PRESSED' }

export type A<T> = Extract<Action, { type: T }>

// -------------
// INITIAL STATE
// -------------

export const initialState: State = {
  size: initialSize,
  fields: newFields(initialSize),
  fieldRotations: new Map(),
  playerDirection: 'down',
  isShuffling: false,
  shuffleSteps: 0,
}

// -------
// REDUCER
// -------

export const reducer: React.Reducer<State, Action> = function reducer(
  state,
  action
) {
  switch (action.type) {
    case 'NOTHING':
      return state

    case 'GROW_BUTTON_CLICKED':
      return sizeReducer(state.size + 1, state)

    case 'SHRINK_BUTTON_CLICKED':
      return sizeReducer(state.size - 1, state)

    case 'KEY_NUMERIC_PRESSED':
      return sizeReducer(action.size, state)

    case 'SHUFFLE_BUTTON_CLICKED':
    case 'KEY_S_PRESSED':
      const { size, shuffleSteps: steps } = state
      return {
        ...state,
        isShuffling: true,
        shuffleSteps: steps > 0 ? steps : shuffleSteps(size),
      }
    case 'SHUFFLE_MOVE_INITIATED':
      return shuffleMoveReducer(state, action)

    case 'STOP_BUTTON_CLICKED':
    case 'SHUFFLE_COMPLETED':
      return {
        ...state,
        isShuffling: false,
        playerDirection: 'down',
      }

    case 'PIECE_CLICKED':
      return fieldClickReducer(state, action)

    case 'KEY_ARROW_PRESSED':
      return keyboardMoveReducer(state, action)

    default:
      return state
  }
}

// ---------------
// ACTION CREATORS
// ---------------

export function shuffleMoveInitiatedAction(
  size: number,
  fields: Field[]
): A<'SHUFFLE_MOVE_INITIATED'> {
  const direction = randomValidDirection(size, fields)
  const rotation = randomAngle()

  return { type: 'SHUFFLE_MOVE_INITIATED', direction, rotation }
}

export function pieceClickedAction(index: number): A<'PIECE_CLICKED'> {
  return { type: 'PIECE_CLICKED', index, rotation: randomAngle() }
}

export function keyPressedAction(
  event: KeyboardEvent
): A<
  'KEY_ARROW_PRESSED' | 'KEY_NUMERIC_PRESSED' | 'KEY_S_PRESSED' | 'NOTHING'
> {
  const key = event.key

  // ARROW KEY

  const direction = keyMap[key]
  if (direction) {
    return {
      type: 'KEY_ARROW_PRESSED',
      direction: direction,
      rotation: randomAngle(),
    }
  }

  // NUMERIC KEY

  const numericKey = Number(key)
  if (sizes.includes(numericKey)) {
    return { type: 'KEY_NUMERIC_PRESSED', size: numericKey }
  }

  // S KEY

  if (key === 's') {
    return { type: 'KEY_S_PRESSED' }
  }

  // UNASSIGNED KEY

  return { type: 'NOTHING' }
}

// -----------------
// REDUCER FUNCTIONS
// -----------------

function sizeReducer(size: number, state: State): State {
  return {
    ...state,
    size,
    fields: newFields(size),
    fieldRotations: new Map(),
    isShuffling: false,
    shuffleSteps: 0,
    playerDirection: 'down',
  }
}

function fieldClickReducer(state: State, action: A<'PIECE_CLICKED'>): State {
  const direction = directionFromEmpty(action.index, state.size, state.fields)

  if (!direction) return state

  return keyboardMoveReducer(state, {
    type: 'KEY_ARROW_PRESSED',
    direction,
    rotation: action.rotation,
  })
}

function keyboardMoveReducer(
  state: State,
  { direction, rotation }: A<'KEY_ARROW_PRESSED'>
): State {
  const fieldIndex = getAdjacentIndex(direction, state.size, state.fields)
  const fieldValue = fieldIndex ? state.fields[fieldIndex] : undefined
  const newRotations = fieldValue
    ? new Map(state.fieldRotations).set(fieldValue, rotation)
    : state.fieldRotations
  const fields = moveEmpty(direction, state.size, state.fields)

  return {
    ...state,
    fields,
    fieldRotations: newRotations,
    playerDirection: direction,
  }
}

function shuffleMoveReducer(
  state: State,
  { direction, rotation }: A<'SHUFFLE_MOVE_INITIATED'>
): State {
  const nullIndex = state.fields.indexOf(null)

  const fields = moveEmpty(direction, state.size, state.fields)
  const movedField = fields[nullIndex]
  const fieldRotations = new Map(state.fieldRotations).set(movedField, rotation)

  return {
    ...state,
    fields,
    fieldRotations,
    playerDirection: direction,
    shuffleSteps: Math.max(0, state.shuffleSteps - 1),
  }
}
