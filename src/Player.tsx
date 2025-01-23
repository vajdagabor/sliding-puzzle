import { memo } from "react"
import { Direction } from "./types"

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
