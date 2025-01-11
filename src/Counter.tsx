import { Button } from "./Button"

interface Props {
  n?: number
  onDecrement?: React.MouseEventHandler
  onIncrement?: React.MouseEventHandler
}

export function Counter({ n = 0, onDecrement, onIncrement }: Props) {
  return (
    <div className="Counter">
      <Button label="−" onClick={onDecrement} />
      <span>{n}</span>
      <Button label="+" onClick={onIncrement} />
    </div>
  )
}
