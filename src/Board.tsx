import { Field as FieldType, Direction, FieldRotationMap } from './types'
import { Field } from './Field'
import { isCorrect } from './model'
import { movePiece } from './reducer'
import { useDispatch } from './store'

interface Props {
  size: number
  fields: FieldType[]
  fieldRotations: FieldRotationMap
  playerDirection: Direction
}

export function Board({
  size,
  fields,
  fieldRotations,
  playerDirection,
}: Props) {
  const boardStyle = {
    '--board-size': size,
  } as React.CSSProperties

  const dispatch = useDispatch()

  return (
    <div className="Board" style={boardStyle}>
      {fields.map((value, i) => (
        <Field
          key={Number(value)}
          value={value}
          rotation={fieldRotations.get(value)}
          isCorrect={isCorrect(i, value)}
          direction={playerDirection}
          onClick={() => dispatch(movePiece(i))}
        />
      ))}
    </div>
  )
}
