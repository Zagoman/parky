import type { InputInfo } from "~/components/CreateProfile/CreateProfile";
import styles from "./InputField.module.scss";
import type { SetStateAction } from "react";
interface InputFieldProps {
  inputType: string;
  value: string;
  label: string;
  name: string;
  placeholder: string;
  error?: string;
  onChange: (value: SetStateAction<InputInfo<string>>) => void;
}
export const InputField: React.FC<InputFieldProps> = (props) => {
  const { inputType, value, label, name, error, placeholder, onChange } = props;
  return (
    <div className={styles.inputWrapper}>
      <label htmlFor={name} className={styles.label}>
        {label}
        <input
          className={error ? styles.inputError : ""}
          type={inputType}
          value={value}
          id={name}
          name={name}
          placeholder={placeholder}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange((old) => ({ ...old, value: e.target.value }))
          }
        />
      </label>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};
