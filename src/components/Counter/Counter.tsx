import { memo } from 'react'
import { Button } from '../Button'
import './style.css'

interface Props {
  n?: number
  min?: number
  max?: number
  onDecrement?: React.MouseEventHandler
  onIncrement?: React.MouseEventHandler
}

export const Counter = memo(Counter_)
function Counter_({ n = 0, min, max, onDecrement, onIncrement }: Props) {
  const canDecrease = min === undefined ? true : n > min
  const canIncrease = max === undefined ? true : n < max

  return (
    <div className="Counter">
      <Button label="−" onClick={onDecrement} disabled={!canDecrease} />
      <span>{n}</span>
      <Button label="+" onClick={onIncrement} disabled={!canIncrease} />
    </div>
  )
}
