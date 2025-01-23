import { memo } from 'react'

interface Props extends React.PropsWithChildren {
  size: number
}

export const Board = memo(Board_)
function Board_({ size, children }: Props) {
  const boardStyle = {
    '--board-size': size,
  } as React.CSSProperties

  return (
    <div className="Board" style={boardStyle}>
      {children}
    </div>
  )
}
