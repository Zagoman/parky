import Link from "next/link";
import styles from "./dashboardMenuElement.module.scss";
import Image from "next/image";

type DashboardMenuElementProps = {
  title: string;
  icon: string;
  active: boolean;
  href: string;
};

export const DashboardMenuElement = ({
  title,
  icon,
  active,
  href,
}: DashboardMenuElementProps) => {
  return (
    <li className={active ? styles.active : ""}>
      <Link href={href} className={styles.wrapper}>
        <Image src={icon} alt={title} width="36" height="36" />
        <div>{title}</div>
      </Link>
    </li>
  );
};
