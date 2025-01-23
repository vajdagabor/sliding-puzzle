import { memo } from "react"

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
}

export const Button = memo(Button_)
function Button_({ label, ...rest}: Props) {
  return (
    <button className="Button" {...rest}>
      {label}
    </button>
  )
}
