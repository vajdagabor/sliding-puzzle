import { useReducer } from 'react'
import { State, reducer } from './reducer'
import { Board } from './Board'
import { newFields } from './model'
import { Header } from './Header'
import { Counter } from './Counter'
import { Button } from './Button'

const minSize = 3
const maxSize = 9
const initialSize = 3
const initialState: State = {
  size: initialSize,
  fields: newFields(initialSize),
}

export function App() {
  const [{ size, fields }, dispatch] = useReducer(reducer, initialState)

  function handleFieldClick(index: number) {
    dispatch({ type: 'MOVE', index })
  }

  function handleShuffleClick() {
    dispatch({ type: 'SHUFFLE' })
  }

  function shrink() {
    dispatch({ type: 'SHRINK' })
  }

  function grow() {
    dispatch({ type: 'GROW' })
  }

  return (
    <>
      <Header title="The Slider Game">
        <Counter
          n={size}
          min={minSize}
          max={maxSize}
          onDecrement={shrink}
          onIncrement={grow}
        />
        <Button label="Shuffle" onClick={handleShuffleClick} />
      </Header>
      <main>
        <Board size={size} fields={fields} onFieldClick={handleFieldClick} />
      </main>
    </>
  )
}
