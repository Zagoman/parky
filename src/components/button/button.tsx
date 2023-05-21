import styles from "./button.module.scss";
import Image from "next/image";

type ButtonProps = {
  onClick: () => void;
  text: string;
  type: string;
  icon?: string;
};

export const Button = ({ onClick, text, type, icon }: ButtonProps) => {
  return (
    <button className={styles[type]} onClick={onClick}>
      {text} {icon && <Image src={icon} alt={"icon"} width={16} height={16} />}
    </button>
  );
};
