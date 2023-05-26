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
              <Image src={filterIcon} alt="filtering icon" />
              <span>
                <p>Sort</p>

                <p>Filter</p>
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
            {userBookingData && !areBookingsLoading
              ? userBookingData.map((booking: BookingElement) => (
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
