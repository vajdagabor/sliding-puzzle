import { Field, move, moveEmpty, newFields, newFieldsShuffled } from './model'

export type State = {
  size: number
  fields: Field[]
}

export type Action =
  | { type: 'GROW' }
  | { type: 'SHRINK' }
  | { type: 'SHUFFLE' }
  | { type: 'FIELDCLICK'; index: number }
  | { type: 'KEYDOWN' }
  | { type: 'KEYUP' }
  | { type: 'KEYLEFT' }
  | { type: 'KEYRIGHT' }

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'GROW': {
      return changeSize(state, 1)
    }

    case 'SHRINK': {
      return changeSize(state, -1)
    }

    case 'SHUFFLE': {
      return {
        ...state,
        fields: newFieldsShuffled(state.size),
      }
    }

    case 'FIELDCLICK': {
      return {
        ...state,
        fields: move(action.index, state.size, state.fields),
      }
    }

    case 'KEYDOWN': {
      return {
        ...state,
        fields: moveEmpty('down', state.size, state.fields),
      }
    }

    case 'KEYUP': {
      return {
        ...state,
        fields: moveEmpty('up', state.size, state.fields),
      }
    }

    case 'KEYLEFT': {
      return {
        ...state,
        fields: moveEmpty('left', state.size, state.fields),
      }
    }

    case 'KEYRIGHT': {
      return {
        ...state,
        fields: moveEmpty('right', state.size, state.fields),
      }
    }

    default:
      return state
  }
}

function changeSize(state: State, delta: number) {
  const size = state.size + delta
  return {
    ...state,
    size,
    fields: newFields(size),
  }
}
