import { useReducer } from 'react'
import { State, reducer, MoveActionTypes } from './reducer'
import { Board } from './Board'
import {
  makeFieldRotations,
  isSorted,
  newFields,
  newFieldsShuffled,
} from './model'
import { Header } from './Header'
import { Counter } from './Counter'
import { Button } from './Button'
import { Lamp } from './Lamp'
import { useGlobalKeyDown } from './useGlobalKeyDown'

const minSize = 3
const maxSize = 9
const initialSize = 3
const initialState: State = {
  size: initialSize,
  fields: newFields(initialSize),
  fieldRotations: new Map(),
  playerDirection: 'down',
}

export function App() {
  const [{ size, fields, fieldRotations, playerDirection }, dispatch] =
    useReducer(reducer, initialState)

  const sorted = isSorted(fields)

  const handleKeyDown = function (event: KeyboardEvent) {
    const actionMap: Record<string, MoveActionTypes> = {
      ArrowDown: 'KEYDOWN',
      ArrowUp: 'KEYUP',
      ArrowLeft: 'KEYLEFT',
      ArrowRight: 'KEYRIGHT',
    }

    const actionType = actionMap[event.key]

    if (actionType) {
      dispatch({ type: actionType })
    }
  }

  useGlobalKeyDown(handleKeyDown)

  function handleFieldClick(index: number) {
    dispatch({ type: 'FIELDCLICK', index })
  }

  function handleShuffleClick() {
    const shuffledFields = newFieldsShuffled(size)
    const fieldRotations = makeFieldRotations(shuffledFields)

    dispatch({ type: 'SHUFFLE', shuffledFields, fieldRotations })
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
        <Lamp isOn={sorted} label={'Sorted'} />
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
        <Board
          size={size}
          fields={fields}
          fieldRotations={fieldRotations}
          playerDirection={playerDirection}
          onFieldClick={handleFieldClick}
        />
      </main>
    </>
  )
}
