import { createContext, useContext, useReducer } from 'react'
import { newFields } from './model'
import { Action, State, reducer } from './reducer'
import { initialSize } from './config'

const initialState: State = {
  size: initialSize,
  fields: newFields(initialSize),
  fieldRotations: new Map(),
  playerDirection: 'down',
  isShuffling: false,
  shuffleSteps: 0
}

const StoreContext = createContext<State>(initialState)
const DispatchContext = createContext<React.Dispatch<Action>>(() => {})

export function StoreProvider({ children }: React.PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <StoreContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StoreContext.Provider>
  )
}

export function useStore() {
  return useContext(StoreContext)
}

export function useDispatch() {
  return useContext(DispatchContext)
}
