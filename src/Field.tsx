import { Field as FieldType } from './model'

interface Props {
  value: FieldType
  isCorrect?: boolean
  onClick: React.MouseEventHandler
}

export function Field({ value, isCorrect = false, onClick }: Props) {
  return (
    <div className="Field" data-value={value} data-correct={isCorrect} onClick={onClick}>
      {value}
    </div>
  )
}
