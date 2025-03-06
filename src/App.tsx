import { useCallback, useEffect, useRef } from 'react'
import { Board } from './components/Board'
import { Button } from './components/Button'
import { Counter } from './components/Counter'
import { Field } from './components/Field'
import { GitHubLogo } from './components/GitHubLogo'
import { Header } from './components/Header'
import { Lamp } from './components/Lamp'
import { Player } from './components/Player'
import { maxSize, minSize, shuffleDelay } from './config'
import { isCorrect, isSorted } from './model'
import {
  keyPressedAction,
  pieceClickedAction,
  shuffleMoveInitiatedAction,
} from './reducer'
import { useDispatch, useStore } from './store'
import { useKeyPress } from './useKeyPress'

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

  useKeyPress(event => dispatch(keyPressedAction(event)))

  // Shuffling
  useEffect(() => {
    if (isShuffling && shuffleSteps > 0) {
      shuffleTimeoutRef.current = setTimeout(() => {
        dispatch(shuffleMoveInitiatedAction(size, fields))
      }, shuffleDelay)
    }

    return () => {
      if (shuffleTimeoutRef.current) {
        clearTimeout(shuffleTimeoutRef.current)
        shuffleTimeoutRef.current = null
      }
      if (shuffleSteps <= 1 && isShuffling)
        dispatch({ type: 'SHUFFLE_COMPLETED' })
    }
  }, [isShuffling, shuffleSteps])

  const handleShuffleClick = useCallback(() => {
    dispatch({ type: 'SHUFFLE_BUTTON_CLICKED' })
    dispatch(shuffleMoveInitiatedAction(size, fields))
  }, [dispatch, size])

  const handleStopClick = useCallback(() => {
    dispatch({ type: 'STOP_BUTTON_CLICKED' })
  }, [dispatch])

  const handleDecrement = useCallback(
    () => dispatch({ type: 'SHRINK_BUTTON_CLICKED' }),
    [dispatch]
  )

  const handleIncrement = useCallback(
    () => dispatch({ type: 'GROW_BUTTON_CLICKED' }),
    [dispatch]
  )

  const handleFieldClick = useCallback(
    (index: number) => dispatch(pieceClickedAction(index)),
    [dispatch]
  )

  return (
    <>
      <Header title="Slider">
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
      <footer>
        <a href="https://github.com/vajdagabor/sliding-puzzle" title='View on GitHub'>
          <GitHubLogo />
        </a>
      </footer>
    </>
  )
}
