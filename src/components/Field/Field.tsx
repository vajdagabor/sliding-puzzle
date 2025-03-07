import { memo } from 'react'
import { Field as FieldType } from '../../types'
import './style.css'

interface Props {
  value: FieldType
  posX: number
  posY: number
  isCorrect?: boolean
  rotation?: number
  onClick: (value: FieldType) => void
}

export const Field = memo(Field_)
function Field_({
  value,
  posX,
  posY,
  isCorrect = false,
  rotation = 0,
  onClick,
}: Props) {
  const gridColumn = `${posX + 1} / ${posX + 2}`
  const gridRow = `${posY + 1} / ${posY + 2}`
  const style: Record<string, string> = {
    '--rotation': `${rotation}deg`,
    gridColumn,
    gridRow,
  }

  const handleClick: React.MouseEventHandler = () => {
    onClick(value)
  }

  return (
    <div
      className="Field"
      style={style}
      data-value={value}
      data-correct={isCorrect}
      onClick={handleClick}
    >
      {value}
    </div>
  )
}
