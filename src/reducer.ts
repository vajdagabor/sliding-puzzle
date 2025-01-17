import {
  Field,
  FieldRotationMap,
  Direction,
  moveEmpty,
  newFields,
  directionFromEmpty,
} from './model'

export type State = {
  size: number
  fields: Field[]
  fieldRotations: FieldRotationMap
  playerDirection: Direction
}

export type MoveActionType = 'KEYDOWN' | 'KEYUP' | 'KEYLEFT' | 'KEYRIGHT'

export type Action =
  | { type: 'GROW' }
  | { type: 'SHRINK' }
  | {
      type: 'SHUFFLE'
      shuffledFields: Field[]
      fieldRotations: FieldRotationMap
    }
  | { type: 'FIELDCLICK'; index: number }
  | { type: 'KEYDOWN' }
  | { type: 'KEYUP' }
  | { type: 'KEYLEFT' }
  | { type: 'KEYRIGHT' }

export type A<T> = Extract<Action, { type: T }>

export const reducer: React.Reducer<State, Action> = function reducer(
  state,
  action
) {
  switch (action.type) {
    case 'GROW':
      return sizeReducer(1, state)
    case 'SHRINK':
      return sizeReducer(-1, state)
    case 'SHUFFLE':
      return {
        ...state,
        fields: action.shuffledFields,
        fieldRotations: action.fieldRotations,
      }
    case 'FIELDCLICK':
      return fieldClickReducer(state, action)
    case 'KEYUP':
      return moveReducer(state, action)
    case 'KEYDOWN':
      return moveReducer(state, action)
    case 'KEYLEFT':
      return moveReducer(state, action)
    case 'KEYRIGHT':
      return moveReducer(state, action)

    default:
      return state
  }
}

function sizeReducer(delta: number, state: State): State {
  const size = state.size + delta
  return {
    ...state,
    size,
    fields: newFields(size),
    fieldRotations: new Map(),
  }
}

function fieldClickReducer(state: State, action: A<'FIELDCLICK'>): State {
  const dir = directionFromEmpty(action.index, state.size, state.fields)
  if (!dir) return state

  const moveActionType = actionByDirection(dir)
  return moveReducer(state, { type: moveActionType })
}

function moveReducer(state: State, action: A<MoveActionType>): State {
  const dir = directionByActionType(action.type)
  return {
    ...state,
    fields: moveEmpty(dir, state.size, state.fields),
    playerDirection: dir,
  }
}

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
