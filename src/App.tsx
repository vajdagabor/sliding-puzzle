import { Board } from './Board'
import { isSorted } from './model'
import { Header } from './Header'
import { Counter } from './Counter'
import { Button } from './Button'
import { Lamp } from './Lamp'
import { useGlobalKeyDown } from './useGlobalKeyDown'
import { minSize, maxSize } from './config'
import { useDispatch, useStore } from './store'
import { globalKeyDown, shuffleFields } from './reducer'

export function App() {
  const { size, fields, fieldRotations, playerDirection } = useStore()
  const dispatch = useDispatch()

  const sorted = isSorted(fields)

  useGlobalKeyDown(event => dispatch(globalKeyDown(event)))

  return (
    <>
      <Header title="The Slider Game">
        <Lamp isOn={sorted} label={'Sorted'} />
        <Counter
          n={size}
          min={minSize}
          max={maxSize}
          onDecrement={() => dispatch({ type: 'SHRINK' })}
          onIncrement={() => dispatch({ type: 'GROW' })}
        />
        <Button label="Shuffle" onClick={() => dispatch(shuffleFields(size))} />
      </Header>
      <main>
        <Board
          size={size}
          fields={fields}
          fieldRotations={fieldRotations}
          playerDirection={playerDirection}
        />
      </main>
    </>
  )
}
