import { type ReactNode } from "react";
import styles from "./uiBox.module.scss";

type UiBoxProps = {
  children: ReactNode;
};

export const UiBox = ({ children }: UiBoxProps) => {
  return <div className={styles.uiBox}>{children}</div>;
};
