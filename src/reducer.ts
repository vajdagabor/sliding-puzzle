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

const arrowKeyMap: Record<string, Direction> = {
  ArrowDown: 'down',
  ArrowUp: 'up',
  ArrowLeft: 'left',
  ArrowRight: 'right',
}

const digitKeyMap: Record<string, number> = {
  Digit2: 2,
  Digit3: 3,
  Digit4: 4,
  Digit5: 5,
  Digit6: 6,
  Digit7: 7,
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
  | { type: 'PIECE_CLICKED'; value: Field; rotation: number }
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

export function pieceClickedAction(
  value: Field
): A<'PIECE_CLICKED'> {
  return { type: 'PIECE_CLICKED', value, rotation: randomAngle() }
}

export function keyPressedAction(
  event: KeyboardEvent
): A<
  'KEY_ARROW_PRESSED' | 'KEY_NUMERIC_PRESSED' | 'KEY_S_PRESSED' | 'NOTHING'
> {
  const code = event.code
  console.log(event)

  // ARROW KEY

  const direction = arrowKeyMap[code]
  if (direction) {
    return {
      type: 'KEY_ARROW_PRESSED',
      direction: direction,
      rotation: randomAngle(),
    }
  }

  // NUMERIC KEY

  const digit = digitKeyMap[code]
  if (digit && sizes.includes(digit)) {
    return { type: 'KEY_NUMERIC_PRESSED', size: digit }
  }

  // S KEY

  if (code === 'KeyS') {
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
  if (action.value === null) return state
  const index = state.fields.indexOf(action.value)

  const direction = directionFromEmpty(index, state.size, state.fields)
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
