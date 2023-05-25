/* eslint-disable @typescript-eslint/restrict-template-expressions */
import styles from "./dashboardWrapper.module.scss";
import { useState } from "react";
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

import { useUser, SignIn } from "@clerk/nextjs";

import { DashboardMenuElement } from "./components/dashboardMenuElement/dashboardMenuElement";
import Link from "next/link";

type DashboardWrapperProps = {
  children: JSX.Element;
  active: string;
};

export const DashboardWrapper = ({
  children,
  active,
}: DashboardWrapperProps) => {
  const [menuVisibility, setMenuVisiblity] = useState<boolean>(false);
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
          <div>
            <Image
              src={accountIcon}
              alt="account icon"
              className={styles.menuIcon}
            />
          </div>
        )}
        {user.isSignedIn && (
          <nav className={menuVisibility ? styles.visible : styles.hidden}>
            <ul>
              <DashboardMenuElement
                href="/dashboard"
                icon={dashboardIcon}
                title="Dashboard"
                active={active === "dashboard" ? true : false}
              />
              <DashboardMenuElement
                href="/my-parking-spots"
                icon={parkingIcon}
                title="My parking spots"
                active={active === "myparkingspots" ? true : false}
              />
              <DashboardMenuElement
                href="/recent-bookings"
                icon={calendarIcon}
                title="Recent bookings"
                active={active === "recentbookings" ? true : false}
              />
              <DashboardMenuElement
                href="/earnings"
                icon={chartIcon}
                title="Earnings overview"
                active={active === "earningsoverview" ? true : false}
              />
              <DashboardMenuElement
                href="/top-up-account"
                icon={parkcoinIcon}
                title="Top up account"
                active={active === "topupaccount" ? true : false}
              />
              <DashboardMenuElement
                href="/get-benefits"
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
                href="/account"
                icon={cogIcon}
                title="Account settings"
                active={active === "accountsettings" ? true : false}
              />
              <DashboardMenuElement
                href="/logout"
                icon={accountIcon}
                title="Log out"
                active={false}
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
