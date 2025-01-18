import { Direction, Field as FieldType } from './model'

interface Props {
  value: FieldType
  isCorrect?: boolean
  direction?: Direction
  rotation?: number
  onClick: React.MouseEventHandler
}

export function Field({
  value,
  isCorrect = false,
  direction,
  rotation = 0,
  onClick,
}: Props) {
  const style: Record<string, string> = {
    '--rotation': `${rotation}deg`,
  }

  return (
    <div
      className="Field"
      style={style}
      data-value={value}
      data-correct={isCorrect}
      data-direction={value === null && direction ? direction : undefined}
      onClick={onClick}
    >
      {value}
    </div>
  )
}
