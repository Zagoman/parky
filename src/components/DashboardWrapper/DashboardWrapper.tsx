/* eslint-disable @typescript-eslint/restrict-template-expressions */
import styles from "./DashboardWrapper.module.scss";
import { useState, useEffect } from "react";
import Image from "next/image";
import logoImage from "../../../public/parky-logo-blue.svg";
import menuImage from "../../../public/icon/menu.svg";
import accountImage from "../../../public/icon/account.svg";
import closeImage from "../../../public/icon/close.svg";
import dashboardImage from "../../../public/icon/dashboard.svg";
import parkingImage from "../../../public/icon/parking.svg";
import calendarImage from "../../../public/icon/calendar.svg";
import chartImage from "../../../public/icon/chart.svg";
import parkcoinImage from "../../../public/icon/Parky-key-blue.svg";
import parkyImage from "../../../public/icon/parky-hex.svg";
import cogImage from "../../../public/icon/settings.svg";
import helpImage from "../../../public/icon/help.svg";

import { useUser, SignIn, SignOutButton } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { DashboardMenuElement } from "./components/DashboardMenuElement/DashboardMenuElement";
import Link from "next/link";

type DashboardWrapperProps = {
  children: JSX.Element;
  active: string;
  userBalance?: number | null;
  userName?: string | null;
  userEmail?: string | null;
};

export const DashboardWrapper = ({
  children,
  active,
  userBalance,
  userEmail,
  userName,
}: DashboardWrapperProps) => {
  const [menuVisibility, setMenuVisiblity] = useState<boolean>(false);
  const [isSignOutVisible, setIsSignOutVisible] = useState(false);
  const logo = logoImage as string;
  const menuIcon = menuImage as string;
  const accountIcon = accountImage as string;
  const closeIcon = closeImage as string;
  const dashboardIcon = dashboardImage as string;
  const parkingIcon = parkingImage as string;
  const calendarIcon = calendarImage as string;
  const chartIcon = chartImage as string;
  const parkcoinIcon = parkcoinImage as string;
  const parkyIcon = parkyImage as string;
  const cogIcon = cogImage as string;
  const helpIcon = helpImage as string;

  const user = useUser();

  const [userId, setUserId] = useState("");
  const { data: userData, refetch: refetchUser } =
    api.profile.getProfileById.useQuery({
      id: userId,
    });

  useEffect(() => {
    if (user.isSignedIn && user.isLoaded) {
      setUserId(user.user.id);
      void refetchUser();
    }
  }, [user.isLoaded]);

  return (
    <>
      <header className={styles.pageHeader}>
        {user.isSignedIn && (
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
        )}
        <div className={styles.pageHeaderLogoWrapper}>
          <Link href="/">
            <Image
              src={logo}
              alt="parky logo"
              className={styles.pageHeaderLogo}
            />
          </Link>
        </div>
        {user.isSignedIn && (
          <div className={styles.accountInfo}>
            {userBalance && (
              <div className={styles.accountBalance}>
                <p>Balance:</p>
                <Link href="/account/topup">
                  <p>{userBalance} </p>
                  <Image
                    src={parkcoinIcon}
                    height={18}
                    width={18}
                    alt="parcoin icon"
                  />
                </Link>
              </div>
            )}
            <div
              className={styles.accountIconWrapper}
              onClick={() =>
                isSignOutVisible
                  ? setIsSignOutVisible(false)
                  : setIsSignOutVisible(true)
              }
              onBlur={() => setIsSignOutVisible(false)}
            >
              <Image
                src={accountIcon}
                alt="account icon"
                className={styles.menuIcon}
              />
              <div className={styles.accountDetails}>
                <p>{userName}</p>
                <p>{userEmail}</p>
              </div>
              <div
                className={
                  isSignOutVisible
                    ? styles.signOut
                    : `${styles.signOut} ${styles.signOutHidden}`
                }
              >
                <SignOutButton />
                <Link href="/account/settings">Account settings</Link>
                <Link href="/help">Help</Link>
                <Link href="/contact">Contact</Link>
              </div>
            </div>
          </div>
        )}
        {user.isSignedIn && (
          <nav className={menuVisibility ? styles.visible : styles.hidden}>
            <ul>
              <DashboardMenuElement
                href="/account"
                icon={dashboardIcon}
                title="Dashboard"
                active={active === "dashboard" ? true : false}
              />
              {userData?.isOwner && (
                <DashboardMenuElement
                  href="account/my-parking-spots"
                  icon={parkingIcon}
                  title="My parking spots"
                  active={active === "myparkingspots" ? true : false}
                />
              )}
              {userData?.isDriver ||
                (userData?.isOwner && (
                  <DashboardMenuElement
                    href="/account/bookings"
                    icon={calendarIcon}
                    title="Parking bookings"
                    active={active === "bookings" ? true : false}
                  />
                ))}
              <DashboardMenuElement
                href="/account/balance"
                icon={chartIcon}
                title="Balance overview"
                active={active === "balance" ? true : false}
              />
              <DashboardMenuElement
                href="/account/topup"
                icon={parkcoinIcon}
                title="Top up account"
                active={active === "topupaccount" ? true : false}
              />
              <DashboardMenuElement
                href="/account/get-benefits"
                icon={parkyIcon}
                title="Get benefits"
                active={active === "benefits" ? true : false}
              />
            </ul>
            <div className={styles.spacer}></div>
            <ul>
              <DashboardMenuElement
                href="/help"
                icon={helpIcon}
                title="Help"
                active={active === "help" ? true : false}
              />
              <DashboardMenuElement
                href="/account/settings"
                icon={cogIcon}
                title="Account settings"
                active={active === "accountsettings" ? true : false}
              />
            </ul>
          </nav>
        )}
      </header>
      <main
        className={user.isSignedIn ? styles.dashboardContents : styles.noUser}
      >
        {user.isSignedIn ? (
          children
        ) : (
          <div className={styles.signIn}>
            <SignIn redirectUrl="/account" />
          </div>
        )}
      </main>
    </>
  );
};
