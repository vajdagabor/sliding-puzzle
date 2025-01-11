export function Header({ children }: React.PropsWithChildren) {
  return (
    <div className="Header">
      <h1 className="Header__Title">The slider game</h1>
      <div className="Header__Tools">{children}</div>
    </div>
  )
}
