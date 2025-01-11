interface Props extends React.PropsWithChildren {
  title: string
}

export function Header({ title, children }: Props) {
  return (
    <div className="Header">
      <h1 className="Header__Title">{title}</h1>
      <div className="Header__Tools">{children}</div>
    </div>
  )
}
