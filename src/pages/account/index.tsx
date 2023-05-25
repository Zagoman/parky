/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { type NextPage } from "next";
import { DashboardWrapper } from "~/components/dashboardWrapper/dashboardWrapper";

import styles from "./index.module.scss";
import { UiBox } from "~/components/uiBox/uiBox";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

import parcoinIconImport from "../../../public/icon/parkcoin-filled.svg";
import calendarIconImport from "../../../public/icon/calendar.svg";
import { DashboardFooter } from "~/components/DashboardElements/components/DashboardFooter/DashboardFooter";

const Home: NextPage = () => {
  const [userId, setUserId] = useState("");
  const user = useUser();
  const {
    data: userData,
    isLoading: isUserLoading,
    refetch,
  } = api.profile.getProfileById.useQuery({
    id: userId,
  });
  // casting
  const parcoinIcon = parcoinIconImport as unknown as string;
  const calendarIcon = calendarIconImport as unknown as string;

  useEffect(() => {
    if (user.isSignedIn) {
      setUserId(user.user.id);
      void refetch();
    }
  }, [user.isLoaded]);

  return (
    <DashboardWrapper active="dashboard">
      <>
        <h2
          className={styles.mainHeader}
        >{`Welcome, ${userData?.username}`}</h2>
        <section className={styles.gridWrapper}>
          <UiBox className={styles.smallBox}>
            <h4>Account balance</h4>
            <span>
              <h2>{userData?.balance}</h2>
              <Image
                src={parcoinIcon}
                alt="parcoin icon"
                height="48"
                width="48"
              />
            </span>
            <Link href="/account/topup">Top up</Link>
          </UiBox>
          <UiBox className={styles.large}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. In
            praesentium, explicabo, ipsam incidunt maiores est repellat dolor
            delectus vero magnam officia quae facilis suscipit similique minima
            porro sit ratione sapiente at laudantium. Quisquam quasi explicabo
            quis. Aliquam nihil sapiente velit dignissimos atque provident,
            temporibus, inventore in eligendi dolorum, incidunt ad tempora
            consequuntur repellat? Cumque quos, facere eligendi quia labore
            perspiciatis. Similique, culpa adipisci quo voluptas blanditiis
            explicabo labore ea quod accusantium animi porro quia tenetur rem
            rerum dignissimos, sequi excepturi! Distinctio ratione voluptatem
            dolorum beatae eligendi nam, accusantium maxime dolores veniam
            ipsum, quas, sed alias eveniet quaerat doloribus aliquid expedita?
          </UiBox>
          <UiBox className={`${styles.order} ${styles.smallBox}`}>
            <h4>Bookings today</h4>
            <span>
              <h2>{userData?.balance}</h2>
              <Image
                src={calendarIcon}
                alt="calendar icon"
                height="48"
                width="48"
              />
            </span>
            <Link href="/account/bookings">See details</Link>
          </UiBox>
          <DashboardFooter>
            <ul>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/help">Help</Link>
              </li>
            </ul>
          </DashboardFooter>
        </section>
      </>
    </DashboardWrapper>
  );
};

export default Home;
