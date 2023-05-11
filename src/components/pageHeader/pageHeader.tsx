import styles from "./pageHeader.module.scss";
import { useState } from "react";
import Image from "next/image";
import logoImage from "../../../public/parky-logo-blue.svg";
import menuImage from "../../../public/icon/menu.svg";
import pageInfoImage from "../../../public/icon/page-info.svg";
import closeImage from "../../../public/icon/close.svg";

export const PageHeader: () => JSX.Element = () => {
  const [menuVisibility, setMenuVisiblity] = useState<boolean>(false);
  const logo = logoImage as string;
  const menuIcon = menuImage as string;
  const pageInfoIcon = pageInfoImage as string;
  const closeIcon = closeImage as string;

  return (
    <header className={styles.pageHeader}>
      {/* page details toggle */}
      {false ? (
        <div>
          <Image
            src={pageInfoIcon}
            alt="pageInfo"
            className={styles.menuIcon}
          />
        </div>
      ) : (
        <div></div>
      )}

      <div className={styles.pageHeaderLogoWrapper}>
        <Image src={logo} alt="parky logo" className={styles.pageHeaderLogo} />
      </div>
      <div
        className={styles.mobileButton}
        onClick={() => {
          menuVisibility ? setMenuVisiblity(false) : setMenuVisiblity(true);
        }}
      >
        <Image
          src={menuVisibility ? closeIcon : menuIcon}
          alt="menu"
          className={styles.menuIcon}
        />
      </div>
      <nav className={menuVisibility ? styles.visible : styles.hidden}>
        <ul>
          <li className={styles.mobileButton}>Home</li>
          <li>Find parking</li>
          <li>How it works</li>
          <li>Help</li>
          <li>Log in</li>
          <li>Sign up</li>
          <li className={styles.pageHeaderCTA}>Rent your parking</li>
        </ul>
      </nav>
    </header>
  );
};
