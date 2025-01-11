import { useState, useEffect } from 'react'
import { Board } from './Board'
import { move, newFields, newFieldsShuffled } from './model'
import { Header } from './Header'
import { Counter } from './Counter'
import { Button } from './Button'

export function App() {
  const [size, setSize] = useState(3)
  const [fields, setFields] = useState(newFields(size))

  useEffect(() => {
    setFields(newFields(size))
  }, [size])

  function handleFieldClick(index: number) {
    setFields(fs => move(index, size, fs))
  }

  function handleShuffleClick() {
    setFields(newFieldsShuffled(size))
  }

  const shrink = () => setSize(s => s - 1)
  const grow = () => setSize(s => s + 1)

  return (
    <>
      <Header title="The Slider Game">
        <Counter n={size} onDecrement={shrink} onIncrement={grow} />
        <Button label="Shuffle" onClick={handleShuffleClick} />
      </Header>
      <main>
        <Board size={size} fields={fields} onFieldClick={handleFieldClick} />
      </main>
    </>
  )
}
