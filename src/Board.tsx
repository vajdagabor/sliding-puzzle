import { Field } from './Field'
import { Field as FieldType, Direction, isCorrect, FieldRotationMap } from './model'

interface Props {
  size: number
  fields: FieldType[]
  fieldRotations: FieldRotationMap
  playerDirection: Direction
  onFieldClick: (index: number) => void
}

export function Board({ size, fields, fieldRotations, playerDirection, onFieldClick }: Props) {
  const boardStyle = {
    '--board-size': size,
  } as React.CSSProperties

  return (
    <div className="Board" style={boardStyle}>
      {fields.map((value, i) => (
        <Field
          key={value}
          value={value}
          rotation={fieldRotations.get(value)}
          isCorrect={isCorrect(i, value)}
          direction={playerDirection}
          onClick={() => onFieldClick(i)}
        />
      ))}
    </div>
  )
}
