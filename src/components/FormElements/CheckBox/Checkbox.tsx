import type { SetStateAction } from "react"
import type { InputInfo } from "~/components/CreateProfile/CreateProfile"

interface CheckboxProps {
  checked: boolean
  label: string
  name: string
  error?: string
  onChange: (value: SetStateAction<InputInfo<boolean>>) => void
}
export const Checkbox: React.FC<CheckboxProps> = (props) => {
  const { checked, label, name, onChange, error } = props
  return (
    <div>
      <label htmlFor={name}>
        {label}
        <input
          type="checkbox"
          checked={checked}
          id={name}
          name={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange((old) => ({ ...old, value: e.target.checked }))
          }
        />
      </label>
      {error && <p> {error} </p>}
    </div>
  )
}
