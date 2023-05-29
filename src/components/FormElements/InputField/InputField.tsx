import styles from "./InputField.module.scss";
import type { FieldValues, UseFormRegister } from "react-hook-form";

interface InputFieldProps {
  id?: string;
  inputType: string;
  label: string;
  name: string;
  placeholder: string;
  error?: string;
  register: UseFormRegister<FieldValues[0]>;
  //eslint-disable-next-line
  [x: string]: any;
}
export const InputField: React.FC<InputFieldProps> = (props) => {
  const { inputType, register, label, name, error, placeholder, id, ...rest } =
    props;

  const options =
    inputType === "number"
      ? { valueAsNumber: true }
      : inputType === "datetime-local"
      ? { valueAsDate: false }
      : {};
  return (
    <div className={styles.inputWrapper}>
      <label
        htmlFor={id ? id : name}
        className={inputType === "checkbox" ? styles.checkbox : styles.label}
      >
        {label}
        <input
          className={error ? styles.inputError : ""}
          type={inputType}
          id={id}
          placeholder={placeholder}
          {...register(name, options)}
          {...rest}
        />
      </label>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};
