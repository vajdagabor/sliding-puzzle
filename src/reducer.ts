import { Direction, Field, FieldRotationMap } from './types'
import { sizes } from './config'
import {
  moveEmpty,
  newFields,
  directionFromEmpty,
  getAdjacentIndex,
  makeFieldRotations,
  newFieldsShuffled,
  randomAngle,
  randomValidDirection,
  shuffleSteps,
} from './model'

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

export type MoveActionType = 'KEYDOWN' | 'KEYUP' | 'KEYLEFT' | 'KEYRIGHT'

export type Action =
  | { type: 'DEFAULT' }
  | { type: 'GROW' }
  | { type: 'SHRINK' }
  | { type: 'SET_SIZE'; size: number }
  | {
      type: 'SHUFFLE'
      shuffledFields: Field[]
      fieldRotations: FieldRotationMap
    }
  | { type: 'START_SHUFFLING' }
  | { type: 'END_SHUFFLING' }
  | { type: 'DECREMENT_SHUFFLE_STEPS' }
  | { type: 'FIELDCLICK'; index: number; rotation: number }
  | { type: 'KEYDOWN'; rotation: number }
  | { type: 'KEYUP'; rotation: number }
  | { type: 'KEYLEFT'; rotation: number }
  | { type: 'KEYRIGHT'; rotation: number }

export type A<T> = Extract<Action, { type: T }>

// -------
// REDUCER
// -------

export const reducer: React.Reducer<State, Action> = function reducer(
  state,
  action
) {
  switch (action.type) {
    case 'DEFAULT':
      return state
    case 'GROW':
      return sizeReducer(state.size + 1, state)
    case 'SHRINK':
      return sizeReducer(state.size - 1, state)
    case 'SET_SIZE':
      return sizeReducer(action.size, state)
    case 'SHUFFLE':
      return {
        ...state,
        fields: action.shuffledFields,
        fieldRotations: action.fieldRotations,
      }
    case 'START_SHUFFLING':
      const { size, shuffleSteps: steps } = state
      return {
        ...state,
        isShuffling: true,
        shuffleSteps: steps > 0 ? steps : shuffleSteps(size),
      }
    case 'END_SHUFFLING':
      return {
        ...state,
        isShuffling: false,
        playerDirection: 'down',
      }
    case 'DECREMENT_SHUFFLE_STEPS':
      return {
        ...state,
        shuffleSteps: Math.max(0, state.shuffleSteps - 1),
      }
    case 'FIELDCLICK':
      return fieldClickReducer(state, action)
    case 'KEYUP':
    case 'KEYDOWN':
    case 'KEYLEFT':
    case 'KEYRIGHT':
      return moveReducer(state, action)

    default:
      return state
  }
}

// -------
// ACTIONS
// -------

export function shuffleFields(size: number): A<'SHUFFLE'> {
  const shuffledFields = newFieldsShuffled(size)
  const fieldRotations = makeFieldRotations(shuffledFields)

  return { type: 'SHUFFLE', shuffledFields, fieldRotations }
}

export function randomMove(size: number, fields: Field[]): A<MoveActionType> {
  const dir = randomValidDirection(size, fields)
  const moveActionType = actionByDirection(dir)

  return { type: moveActionType, rotation: randomAngle() }
}

export function movePiece(index: number): A<'FIELDCLICK'> {
  return { type: 'FIELDCLICK', index, rotation: randomAngle() }
}

export function globalKeyDown(
  event: KeyboardEvent
): A<MoveActionType> | A<'SET_SIZE'> | A<'DEFAULT'> {
  const rotation = randomAngle()
  const key = event.key

  if (key === 'ArrowDown') return { type: 'KEYDOWN', rotation }
  if (key === 'ArrowUp') return { type: 'KEYUP', rotation }
  if (key === 'ArrowLeft') return { type: 'KEYLEFT', rotation }
  if (key === 'ArrowRight') return { type: 'KEYRIGHT', rotation }

  if (sizes.includes(Number(key))) {
    return { type: 'SET_SIZE', size: Number(key) }
  }

  return { type: 'DEFAULT' }
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

function fieldClickReducer(state: State, action: A<'FIELDCLICK'>): State {
  const dir = directionFromEmpty(action.index, state.size, state.fields)

  if (!dir) return state

  const moveActionType = actionByDirection(dir)
  return moveReducer(state, { type: moveActionType, rotation: action.rotation })
}

function moveReducer(state: State, action: A<MoveActionType>): State {
  const dir = directionByActionType(action.type)
  const fieldIndex = getAdjacentIndex(dir, state.size, state.fields)
  const fieldValue = fieldIndex ? state.fields[fieldIndex] : undefined
  const newRotations = fieldValue
    ? new Map(state.fieldRotations).set(fieldValue, action.rotation)
    : state.fieldRotations

  return {
    ...state,
    fields: moveEmpty(dir, state.size, state.fields),
    fieldRotations: newRotations,
    playerDirection: dir,
  }
}

// -------
// HELPERS
// -------

export function actionByDirection(dir: Direction): MoveActionType {
  const directionMap: Record<Direction, MoveActionType> = {
    down: 'KEYDOWN',
    up: 'KEYUP',
    left: 'KEYLEFT',
    right: 'KEYRIGHT',
  }
  return directionMap[dir]
}

export function directionByActionType(action: MoveActionType): Direction {
  const directionMap: Record<MoveActionType, Direction> = {
    KEYDOWN: 'down',
    KEYUP: 'up',
    KEYLEFT: 'left',
    KEYRIGHT: 'right',
  }
  return directionMap[action]
}
