import { memo } from 'react'
import { Field as FieldType } from './types'

interface Props {
  value: FieldType
  index: number
  isCorrect?: boolean
  rotation?: number
  onClick: (index: number) => void
}

export const Field = memo(Field_)
function Field_({
  value,
  index,
  isCorrect = false,
  rotation = 0,
  onClick,
}: Props) {
  const style: Record<string, string> = {
    '--rotation': `${rotation}deg`,
  }

  const handleClick: React.MouseEventHandler = () => {
    onClick(index)
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
