import { memo } from "react"
import { Direction } from "../../types"
import './style.css'

interface Props {
  direction: Direction
  posX: number
  posY: number
}

export const Player = memo(Player_)
function Player_({ direction = 'down', posX, posY}: Props) {
  const gridColumn = `${posX + 1} / ${posX + 2}`
  const gridRow = `${posY + 1} / ${posY + 2}`

  return (
    <div
      className="Player"
      style={{gridColumn, gridRow}}
      data-direction={direction}
    >
      🐭
    </div>
  )
}
