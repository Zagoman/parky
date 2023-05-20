import styles from "./pageHeader.module.scss";
import { useState } from "react";
import Image from "next/image";
import menuImage from "../../../public/icon/menu.svg";
import pageInfoImage from "../../../public/icon/page-info.svg";
import closeImage from "../../../public/icon/close.svg";
import PakyLogoBlue from "../../../public/parky-logo-blue.svg";

type headerProps = {
  children: JSX.Element;
  secondaryMenu: boolean;
  secondaryMenuContents: JSX.Element | null;
};

export const PageHeader = ({
  children,
  secondaryMenu,
  secondaryMenuContents,
}: headerProps) => {
  const [menuVisibility, setMenuVisiblity] = useState<boolean>(false);
  const [secondaryMenuVisibility, setSecondaryMenuVisiblity] =
    useState<boolean>(false);
  const menuIcon = menuImage as string;
  const pageInfoIcon = pageInfoImage as string;
  const closeIcon = closeImage as string;
  const parkyLogo = PakyLogoBlue as string;
  return (
    <>
      <header className={styles.pageHeader}>
        {/* page details toggle */}
        {secondaryMenu ? (
          <>
            <div>
              <Image
                src={pageInfoIcon}
                alt="pageInfo"
                className={styles.menuIcon}
                onClick={() => {
                  secondaryMenuVisibility
                    ? setSecondaryMenuVisiblity(false)
                    : setSecondaryMenuVisiblity(true);
                  menuVisibility && setMenuVisiblity(false);
                }}
              />
            </div>
            <section
              className={
                secondaryMenuVisibility
                  ? styles.visible
                  : styles.hiddenSecondary
              }
            >
              <div>{secondaryMenuContents}</div>
            </section>
          </>
        ) : (
          <div></div>
        )}

        <div className={styles.pageHeaderLogoWrapper}>
          <Image
            src={parkyLogo}
            width="200"
            height="50"
            alt="parky logo"
            className={styles.pageHeaderLogo}
          />
        </div>
        <div
          className={styles.mobileButton}
          onClick={() => {
            menuVisibility ? setMenuVisiblity(false) : setMenuVisiblity(true);
            secondaryMenuVisibility && setSecondaryMenuVisiblity(false);
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
      <section className={secondaryMenu ? styles.contentWrapper : ""}>
        {children}
      </section>
    </>
  );
};
