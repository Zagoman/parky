import styles from "./uiBox.module.scss";

type UiBoxProps = {
  children: any;
};

export const UiBox = ({ children }: UiBoxProps) => {
  return <div className={styles.uiBox}>{children}</div>;
};
