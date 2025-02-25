import { createContext, useContext, useReducer } from 'react'
import { Action, State, reducer, initialState } from './reducer'

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
