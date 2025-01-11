import { useState } from 'react'
import { Board } from "./Board";
import { move, newFieldsShuffled } from "./model"

export function App() {
  const size = 4
  const [fields, setFields] = useState(newFieldsShuffled(size))

  function handleFieldClick(index: number) {
    setFields(fs => move(index, size, fs))
  }

  return (
    <>
      <Board size={size} fields={fields} onFieldClick={handleFieldClick} />
    </>
  )
}
