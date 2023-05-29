import styles from "./InputField.module.scss"
import type { FieldValues, UseFormRegister } from "react-hook-form"

interface TextAreaProps {
  label: string
  name: string
  placeholder: string
  error?: string
  register: UseFormRegister<FieldValues[0]>
  //eslint-disable-next-line
  [x: string]: any
}
export const TextArea: React.FC<TextAreaProps> = (props) => {
  const { register, label, name, error, placeholder, ...rest } = props

  return (
    <div className={styles.inputWrapper}>
      <label htmlFor={name} className={styles.label}>
        {label}
        <textarea
          className={error ? styles.inputError : ""}
          id={name}
          placeholder={placeholder}
          {...register(name)}
          {...rest}
        />
      </label>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
