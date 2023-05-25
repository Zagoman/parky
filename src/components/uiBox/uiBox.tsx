/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { type ReactNode } from "react";
import styles from "./uiBox.module.scss";

type UiBoxProps = {
  children: ReactNode;
  className?: string;
};

export const UiBox = ({ children, className }: UiBoxProps) => {
  return (
    <div className={className ? `${styles.uiBox} ${className}` : styles.uiBox}>
      {children}
    </div>
  );
};
