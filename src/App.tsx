import { Board } from './Board'
import { isCorrect, isSorted } from './model'
import { Header } from './Header'
import { Counter } from './Counter'
import { Button } from './Button'
import { Lamp } from './Lamp'
import { useGlobalKeyDown } from './useGlobalKeyDown'
import { minSize, maxSize } from './config'
import { useDispatch, useStore } from './store'
import { globalKeyDown, movePiece, randomMove } from './reducer'
import { useCallback, useEffect, useRef } from 'react'
import { Field } from './Field'
import { Player } from './Player'

const SHUFFLE_DELAY = 1 // ms

export function App() {
  const {
    size,
    fields,
    fieldRotations,
    playerDirection,
    isShuffling,
    shuffleSteps,
  } = useStore()
  const dispatch = useDispatch()
  const shuffleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useGlobalKeyDown(event => dispatch(globalKeyDown(event)))

  // Shuffling
  useEffect(() => {
    if (isShuffling && shuffleSteps > 0) {
      shuffleTimeoutRef.current = setTimeout(() => {
        shuffleStep()
      }, SHUFFLE_DELAY)
    }

    return () => {
      if (shuffleTimeoutRef.current) {
        clearTimeout(shuffleTimeoutRef.current)
        shuffleTimeoutRef.current = null
      }
      if (shuffleSteps <= 1 && isShuffling) dispatch({ type: 'END_SHUFFLING' })
    }
  }, [isShuffling, shuffleSteps])

  function shuffleStep() {
    dispatch(randomMove(size, fields))
    dispatch({ type: 'DECREMENT_SHUFFLE_STEPS' })
  }

  const handleShuffleClick = useCallback(() => {
    dispatch({ type: 'START_SHUFFLING' })
    shuffleStep()
  }, [dispatch, size])

  const handleStopClick = useCallback(() => {
    dispatch({ type: 'END_SHUFFLING' })
  }, [dispatch])

  const handleDecrement = useCallback(
    () => dispatch({ type: 'SHRINK' }),
    [dispatch]
  )

  const handleIncrement = useCallback(
    () => dispatch({ type: 'GROW' }),
    [dispatch]
  )

  const handleMoveClick = useCallback(
    () => dispatch(randomMove(size, fields)),
    [dispatch, size, fields]
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
        {isShuffling ? (
          <Button label="Stop" onClick={handleStopClick} />
        ) : (
          <Button label="Shuffle" onClick={handleShuffleClick} />
        )}
        <Button label="Move" onClick={handleMoveClick} />
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
