import { Field as FieldType } from './model'

interface Props {
  value: FieldType
  onClick: React.MouseEventHandler
}

export function Field({ value, onClick }: Props) {
  return (
    <div className="Field" data-value={value} onClick={onClick}>
      {value}
    </div>
  )
}
