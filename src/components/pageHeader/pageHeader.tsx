/* eslint-disable @typescript-eslint/restrict-template-expressions */
import styles from "./pageHeader.module.scss";
import { useEffect, useState } from "react";
import Image from "next/image";
import menuImage from "../../../public/icon/menu.svg";
import pageInfoImage from "../../../public/icon/page-info.svg";
import closeImage from "../../../public/icon/close.svg";
import PakyLogoBlue from "../../../public/parky-logo-blue.svg";
import { SignOutButton, useUser, SignIn, SignUp } from "@clerk/nextjs";

import Link from "next/link";

type headerProps = {
  children: JSX.Element;
  secondaryMenu: boolean;
  secondaryMenuContents?: null | (() => JSX.Element);
  active?: string;
};

export const PageHeader = ({
  children,
  secondaryMenu,
  secondaryMenuContents,
  active,
}: headerProps) => {
  const [menuVisibility, setMenuVisiblity] = useState<boolean>(false);
  const [secondaryMenuVisibility, setSecondaryMenuVisiblity] =
    useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContents, setModalContents] = useState<JSX.Element>();
  const user = useUser();

  const menuIcon = menuImage as string;
  const pageInfoIcon = pageInfoImage as string;
  const closeIcon = closeImage as string;
  const parkyLogo = PakyLogoBlue as string;

  useEffect(() => {
    if (user.isSignedIn) {
      console.log(user.isSignedIn);
      setIsModalVisible(false);
    }
  }, [user.isSignedIn, user]);

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
              <div>{secondaryMenuContents && secondaryMenuContents()}</div>
            </section>
          </>
        ) : (
          <div></div>
        )}

        <div className={styles.pageHeaderLogoWrapper}>
          <Link href="/">
            <Image
              src={parkyLogo}
              width="200"
              height="50"
              alt="parky logo"
              className={styles.pageHeaderLogo}
            />
          </Link>
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
            <li className={styles.mobileButton}>
              <Link href="/">Home</Link>
            </li>
            <li className={active === "map" ? styles.activeHeaderLink : ""}>
              <Link href="/map">Find parking</Link>
            </li>
            <li className={active === "help" ? styles.activeHeaderLink : ""}>
              <Link href="/help">Help</Link>
            </li>
            {!user.isSignedIn ? (
              <>
                <li
                  onClick={() => {
                    setModalContents(<SignIn afterSignInUrl="/" />);
                    setIsModalVisible(true);
                  }}
                >
                  Sign in
                </li>
                <li
                  onClick={() => {
                    setModalContents(<SignUp redirectUrl="/profile/create" />);
                    setIsModalVisible(true);
                  }}
                >
                  Sign up
                </li>
              </>
            ) : (
              <>
                <li>
                  <SignOutButton />
                </li>
                <li>
                  <Link href="/account">Account</Link>
                </li>
              </>
            )}
            {user.isSignedIn && user.isLoaded && (
              <Link
                className={styles.pageHeaderCTA}
                href="/account/my-parking-spots"
              >
                Rent your parking
              </Link>
            )}
          </ul>
        </nav>
      </header>
      <section className={secondaryMenu ? styles.contentWrapper : ""}>
        {!user.isSignedIn && (
          <div
            className={
              isModalVisible && modalContents
                ? `${styles.modal} `
                : `${styles.modal} ${styles.modalHidden}`
            }
          >
            <div className={styles.modalWrapper}>
              <span
                className={styles.modalWrapperClose}
                onClick={() => {
                  setIsModalVisible(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  fill="#566777"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </span>
              {modalContents}
            </div>
          </div>
        )}
        {children}
      </section>
    </>
  );
};
