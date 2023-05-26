import { UiBox } from "~/components/uiBox/uiBox";
import styles from "./DashboardFooter.module.scss";

type DashboardFooterProps = {
  children: JSX.Element;
};

export const DashboardFooter = ({ children }: DashboardFooterProps) => {
  return (
    <UiBox className={styles.footer}>
      {children} <p className={styles.copy}>©2023 Parky</p>
    </UiBox>
  );
};
