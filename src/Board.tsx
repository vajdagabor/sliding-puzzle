import { Field } from './Field'
import { Field as FieldType, Direction, isCorrect } from './model'

interface Props {
  size: number
  fields: FieldType[]
  playerDirection: Direction
  onFieldClick: (index: number) => void
}

export function Board({ size, fields, playerDirection, onFieldClick }: Props) {
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
          direction={playerDirection}
          onClick={() => onFieldClick(i)}
        />
      ))}
    </div>
  )
}
