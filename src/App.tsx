import { useState, useEffect } from 'react'
import { Board } from './Board'
import { move, newFields } from './model'
import { Header } from './Header'
import { Counter } from './Counter'

export function App() {
  const [size, setSize] = useState(3)
  const [fields, setFields] = useState(newFields(size))

  useEffect(() => {
    setFields(newFields(size))
  }, [size])

  function handleFieldClick(index: number) {
    setFields(fs => move(index, size, fs))
  }

  const shrink = () => setSize(s => s - 1)
  const grow = () => setSize(s => s + 1)

  return (
    <>
      <Header>
        <Counter n={size} onDecrement={shrink} onIncrement={grow} />
      </Header>
      <main>
        <Board size={size} fields={fields} onFieldClick={handleFieldClick} />
      </main>
    </>
  )
}
