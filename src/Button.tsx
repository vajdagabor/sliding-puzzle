interface Props {
  label: string
  onClick?: React.MouseEventHandler
}

export function Button({ label, onClick }: Props) {
  return <button className="Button" onClick={onClick}>{label}</button>
}
