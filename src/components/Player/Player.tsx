import { memo } from "react"
import { Direction } from "../../types"
import './style.css'

interface Props {
  direction: Direction
}

export const Player = memo(Player_)
function Player_({ direction = 'down'}: Props) {
  return (
    <div
      className="Player"
      data-direction={direction}
    >
      🐭
    </div>
  )
}
