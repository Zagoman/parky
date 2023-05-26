/* eslint-disable @typescript-eslint/restrict-template-expressions */
import styles from "./index.module.scss";
import { type NextPage } from "next";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import filterIconImport from "../../../../public/icon/filter.svg";

import { DashboardWrapper } from "~/components/DashboardWrapper/DashboardWrapper";
import { UiBox } from "~/components/uiBox/uiBox";
import {
  BookingItem,
  type BookingElement,
} from "~/components/DashboardElements/components/BookingItem/BookingItem";
import Image from "next/image";

const Home: NextPage = () => {
  const [userId, setUserId] = useState("");
  const [activeView, setActiveView] = useState("");
  const [sortingValue, setSortingValue] = useState("default");
  const [bookingItems, setBookingItems] = useState<BookingElement[]>([]);
  const [isSortingVisible, setIsSortingVisible] = useState(false);
  const user = useUser();

  const { data: userData, refetch: refetchUser } =
    api.profile.getProfileById.useQuery({
      id: userId,
    });

  const {
    data: userBookingData,
    isLoading: areBookingsLoading,
    refetch: refetchBookings,
  } = api.booking.getBookingsByUserId.useQuery({
    userId: userId,
  });

  const filterIcon = filterIconImport as unknown as string;

  useEffect(() => {
    if (user.isSignedIn && user.isLoaded) {
      setUserId(user.user.id);
      void refetchUser();
      void refetchBookings();
    }
  }, [user.isLoaded]);

  useEffect(() => {
    if (userBookingData?.length) {
      setBookingItems(userBookingData);
    }
  }, [userBookingData]);

  useEffect(() => {
    if (userBookingData?.length) {
      if (sortingValue === "default") {
        setBookingItems(userBookingData);
      } else if (sortingValue === "newest") {
        const sorted = [...userBookingData];
        setBookingItems(
          sorted.sort((a, b) => {
            return new Date(b.start).getTime() - new Date(a.start).getTime();
          })
        );
      } else if (sortingValue === "oldest") {
        const sorted = [...userBookingData];
        setBookingItems(
          sorted.sort((a, b) => {
            return new Date(a.start).getTime() - new Date(b.start).getTime();
          })
        );
      } else if (sortingValue === "cost") {
        const sorted = [...userBookingData];
        setBookingItems(
          sorted.sort((a, b) => {
            return b.price - a.price;
          })
        );
      } else if (sortingValue === "duration") {
        const sorted = [...userBookingData];
        setBookingItems(
          sorted.sort((a, b) => {
            return (
              b.end.getHours() -
              b.start.getHours() -
              (a.end.getHours() - a.start.getHours())
            );
          })
        );
      }
    }
  }, [sortingValue]);

  return (
    <DashboardWrapper
      active="bookings"
      userBalance={userData?.balance}
      userName={userData?.username}
      userEmail={user.user?.primaryEmailAddress?.emailAddress}
    >
      <>
        <div className={styles.headerWrapper}>
          <div>
            <div>
              <h2>{userData?.isDriver ? "My Bookings" : "Bookings"}</h2>
              {userData?.isDriver && userData?.isOwner && (
                <div className={styles.viewToggleWrapper}>
                  {activeView === "driver" ? (
                    <p onClick={() => setActiveView("owner")}>
                      Change to owner
                    </p>
                  ) : (
                    <p onClick={() => setActiveView("driver")}>
                      Change to driver
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className={styles.filters}>
              <Image
                src={filterIcon}
                alt="filtering icon"
                onClick={() => {
                  isSortingVisible
                    ? setIsSortingVisible(false)
                    : setIsSortingVisible(true);
                }}
              />
              <span
                className={
                  isSortingVisible
                    ? styles.sortingWrapper
                    : `${styles.sortingWrapper} ${styles.sortingHidden}`
                }
              >
                <select
                  className={styles.selectInput}
                  value={sortingValue}
                  onChange={(e) => {
                    setSortingValue(e.target.value);
                  }}
                >
                  <option value="default" className={styles.selectOption}>
                    Default sorting
                  </option>
                  <option value="newest" className={styles.selectOption}>
                    Sort by newest
                  </option>
                  <option value="oldest" className={styles.selectOption}>
                    Sort by oldest
                  </option>
                  <option value="cost" className={styles.selectOption}>
                    Sort by cost
                  </option>
                  <option value="duration" className={styles.selectOption}>
                    Sort by duration
                  </option>
                </select>
              </span>
            </div>
          </div>
        </div>
        <UiBox className={styles.bookingListWrapper}>
          <div className={styles.bookingListHeader}>
            <p>Location & date</p>
            <p>Price</p>
            <p>Details</p>
          </div>
          <ul>
            {bookingItems && !areBookingsLoading
              ? bookingItems.map((booking: BookingElement) => (
                  <BookingItem key={booking.id} booking={booking} />
                ))
              : areBookingsLoading
              ? "loading"
              : "No bookings found"}
          </ul>
        </UiBox>
      </>
    </DashboardWrapper>
  );
};

export default Home;
