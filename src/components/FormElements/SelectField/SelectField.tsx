import styles from "./SelectField.module.scss"
import type { SetStateAction } from "react"
import type { InputInfo } from "~/components/CreateProfile/CreateProfile"

interface SelectFieldProps<T> {
  value: T
  label: string
  name: string
  placeholder: string
  options: { label: string; value: T }[]
  error?: string
  initialValue?: T
  onChange: (value: SetStateAction<InputInfo<T>>) => void
}

function SelectField<T extends string>(props: SelectFieldProps<T>) {
  const {
    value,
    label,
    name,
    placeholder,
    initialValue,
    options,
    error,
    onChange,
  } = props
  return (
    <div>
      <label>
        {label}
        <select
          value={value}
          onChange={(e) => onChange({ value: e.target.value as T })}
          name={name}
          required
        >
          <option value={initialValue || ""} disabled={true}>
            {placeholder}
          </option>
          {options.map((el) => (
            <option key={el.value} value={el.value}>
              {el.label}
            </option>
          ))}
        </select>
      </label>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  )
}
export default SelectField
