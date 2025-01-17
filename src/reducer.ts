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

export type MoveActionTypes = 'KEYDOWN' | 'KEYUP' | 'KEYLEFT' | 'KEYRIGHT'

export type Action =
  | { type: 'GROW' }
  | { type: 'SHRINK' }
  | {
      type: 'SHUFFLE'
      shuffledFields: Field[]
      fieldRotations: FieldRotationMap
    }
  | { type: 'FIELDCLICK'; index: number }
  | { type: 'KEYDOWN';  }
  | { type: 'KEYUP';  }
  | { type: 'KEYLEFT';  }
  | { type: 'KEYRIGHT';  }

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'GROW': {
      return sizeReducer(1, state)
    }

    case 'SHRINK': {
      return sizeReducer(-1, state)
    }

    case 'SHUFFLE': {
      return {
        ...state,
        fields: action.shuffledFields,
        fieldRotations: action.fieldRotations,
      }
    }

    case 'FIELDCLICK': {
      const direction = directionFromEmpty(
        action.index,
        state.size,
        state.fields
      )
      return moveReducer(direction, state)
    }

    case 'KEYDOWN': {
      return moveReducer('down', state)
    }

    case 'KEYUP': {
      return moveReducer('up', state)
    }

    case 'KEYLEFT': {
      return moveReducer('left', state)
    }

    case 'KEYRIGHT': {
      return moveReducer('right', state)
    }

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

function moveReducer(
  dir: Direction | undefined,
  state: State
): State {
  if (dir === undefined) return state
  return {
    ...state,
    fields: moveEmpty(dir, state.size, state.fields),
    playerDirection: dir,
  }
}
