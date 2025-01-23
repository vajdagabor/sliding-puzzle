import { Board } from './Board'
import { isCorrect, isSorted } from './model'
import { Header } from './Header'
import { Counter } from './Counter'
import { Button } from './Button'
import { Lamp } from './Lamp'
import { useGlobalKeyDown } from './useGlobalKeyDown'
import { minSize, maxSize } from './config'
import { useDispatch, useStore } from './store'
import { globalKeyDown, movePiece, shuffleFields } from './reducer'
import { useCallback } from 'react'
import { Field } from './Field'
import { Player } from './Player'

export function App() {
  const { size, fields, fieldRotations, playerDirection } = useStore()
  const dispatch = useDispatch()

  useGlobalKeyDown(event => dispatch(globalKeyDown(event)))

  const handleDecrement = useCallback(
    () => dispatch({ type: 'SHRINK' }),
    [dispatch]
  )

  const handleIncrement = useCallback(
    () => dispatch({ type: 'GROW' }),
    [dispatch]
  )

  const handleShuffleClick = useCallback(
    () => dispatch(shuffleFields(size)),
    [dispatch, size]
  )

  const handleFieldClick = useCallback(
    (index: number) => dispatch(movePiece(index)),
    [dispatch]
  )

  return (
    <>
      <Header title="The Slider Game">
        <Lamp isOn={isSorted(fields)} label={'Sorted'} />
        <Counter
          n={size}
          min={minSize}
          max={maxSize}
          onDecrement={handleDecrement}
          onIncrement={handleIncrement}
        />
        <Button label="Shuffle" onClick={handleShuffleClick} />
      </Header>
      <main>
        <Board size={size}>
          {fields.map((value, i) =>
            value === null ? (
              <Player key={Number(value)} direction={playerDirection} />
            ) : (
              <Field
                key={value}
                value={value}
                rotation={fieldRotations.get(value)}
                isCorrect={isCorrect(i, value)}
                onClick={handleFieldClick}
                index={i}
              />
            )
          )}
        </Board>
      </main>
    </>
  )
}
