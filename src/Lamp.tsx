interface Props {
  label: string
  isOn: boolean
}
export function Lamp({ label, isOn = false }: Props) {
  return (
    <div className="Lamp" data-state={isOn ? 'on' : 'off'}>
      <span className="Lamp__Indicator" aria-hidden="true"></span>
      <span className="Lamp__Label">{label}</span>
    </div>
  )
}
