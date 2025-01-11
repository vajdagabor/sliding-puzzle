import { Field } from './Field'
import { Field as FieldType } from './model'

interface Props {
  size: number
  fields: FieldType[]
  onFieldClick: (index: number) => void
}

export function Board({ size, fields, onFieldClick }: Props) {
  const boardStyle = {
    '--board-size': size,
  } as React.CSSProperties

  return (
    <div className="Board" style={boardStyle}>
      {fields.map((field, i) => (
        <Field key={field} value={field} onClick={() => onFieldClick(i)} />
      ))}
    </div>
  )
}
