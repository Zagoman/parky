import styles from "./InputField.module.scss"
interface InputFieldProps {
  inputType: string
  value: string
  label: string
  name: string
  placeholder: string
  onChange: (value: string) => void
}
export const InputField: React.FC<InputFieldProps> = (props) => {
  const { inputType, value, label, name, placeholder, onChange } = props
  return (
    <div className={styles.inputWrapper}>
      <label htmlFor={name} className={styles.label}>
        {label}
        <input
          type={inputType}
          value={value}
          id={name}
          name={name}
          placeholder={placeholder}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
        />
      </label>
    </div>
  )
}
