interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
}

export function Button({ label, ...rest}: Props) {
  return (
    <button className="Button" {...rest}>
      {label}
    </button>
  )
}
