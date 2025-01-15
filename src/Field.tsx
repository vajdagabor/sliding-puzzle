import { Direction, Field as FieldType } from './model'

interface Props {
  value: FieldType
  isCorrect?: boolean
  direction?: Direction
  onClick: React.MouseEventHandler
}

export function Field({ value, isCorrect = false, direction, onClick }: Props) {
  return (
    <div
      className="Field"
      data-value={value}
      data-correct={isCorrect}
      data-direction={direction ? direction : undefined}
      onClick={onClick}
    >
      {value}
    </div>
  )
}
