import { Field, move, newFields, newFieldsShuffled } from './model'

export type State = {
  size: number
  fields: Field[]
}

export type Action =
  | { type: 'GROW' }
  | { type: 'SHRINK' }
  | { type: 'MOVE'; index: number }
  | { type: 'SHUFFLE' }

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'GROW': {
      return changeSize(state, 1)
    }

    case 'SHRINK': {
      return changeSize(state, -1)
    }

    case 'MOVE': {
      return {
        ...state,
        fields: move(action.index, state.size, state.fields),
      }
    }

    case 'SHUFFLE': {
      return {
        ...state,
        fields: newFieldsShuffled(state.size)
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
    fields: newFields(size)
  }
}
