import styles from "./Toggle.module.scss";

type ToggleProps = {
  activeValue: string;
  names: string[];
  values: [string, string];
  onClick: (type: string) => void;
};

export const Toggle = ({
  names,
  values,
  onClick,
  activeValue,
}: ToggleProps) => {
  return (
    <div className={styles.toggle}>
      <button
        onClick={() => onClick(values[0])}
        className={activeValue === values[0] ? styles.active : ""}
      >
        {names[0]}
      </button>
      <button
        onClick={() => onClick(values[1])}
        className={activeValue === values[1] ? styles.active : ""}
      >
        {names[1]}
      </button>
    </div>
  );
};
