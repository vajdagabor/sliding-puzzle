import { Field } from './Field'
import { Field as FieldType, isCorrect } from './model'

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
      {fields.map((value, i) => (
        <Field
          key={value}
          value={value}
          isCorrect={isCorrect(size, i, value)}
          onClick={() => onFieldClick(i)}
        />
      ))}
    </div>
  )
}
