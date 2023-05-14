import styles from "./button.module.scss";

type ButtonProps = {
  onClick: () => void;
  text: string;
  type: string;
};

export const Button = ({ onClick, text, type }: ButtonProps) => {
  return (
    <button className={styles[type]} onClick={onClick}>
      {text}
    </button>
  );
};
