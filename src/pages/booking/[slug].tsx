/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { DashboardWrapper } from "~/components/DashboardWrapper/DashboardWrapper";
import { api } from "~/utils/api";
import { useState } from "react";
import { UiBox } from "~/components/uiBox/uiBox";
import { type BookingElement } from "~/components/DashboardElements/components/BookingItem/BookingItem";
import { DashboardFooter } from "~/components/DashboardElements/components/DashboardFooter/DashboardFooter";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { StarRating } from "~/components/StarRating/StarRating";

import styles from "./booking.module.scss";
import Image from "next/image";

import parcoinImport from "../../../public/icon/parkcoin-filled.svg";

const Booking: NextPage = () => {
  const [bookingId, setBookingId] = useState("");
  const [bookingData, setBookingData] = useState<BookingElement>();
  const [driverId, setDriverId] = useState("");
  const [spotId, setSpotId] = useState("");

  const router = useRouter();
  const { data, refetch, isLoading } = api.booking.getBookingById.useQuery({
    bookingId: bookingId,
  });

  const user = useUser();

  const {
    data: driverData,
    refetch: refetchDriver,
    isLoading: isLoadingDriver,
  } = api.profile.getProfileById.useQuery({
    id: driverId,
  });

  const {
    data: spotData,
    refetch: refetchSpot,
    isLoading: isSpotLoading,
  } = api.parking.getParkingById.useQuery({
    id: spotId,
  });

  const parcoinIcon = parcoinImport as unknown as string;

  useEffect(() => {
    if (router.query.slug) {
      const id: string | string[] = router.query.slug;
      if (typeof id === "string") {
        setBookingId(id);
        void refetch();
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoading && data) {
      const fetchedData = data[0] as unknown as BookingElement;
      setBookingData(fetchedData);
    }
  }, [isLoading, data]);

  useEffect(() => {
    if (!isLoading && data && bookingData) {
      setDriverId(bookingData.profileId);
      setSpotId(bookingData.parkingId);
      void refetchDriver();
      void refetchSpot();
    }
  }, [bookingData]);

  return (
    <DashboardWrapper active={"bookings"}>
      <main className={styles.main}>
        <div>
          {isLoading && <div>Loader</div>}
          {bookingData && (
            <section className={styles.booking}>
              <h2>{`Booking #${bookingData.bookingNumber}`}</h2>
              <UiBox className={styles.bookingDetails}>
                <section>
                  <h4>Order information</h4>
                  <div>
                    <p>Parking name</p>
                    <p>{spotData?.address}</p>
                  </div>
                  <div>
                    <p>Date</p>
                    <p>{`${bookingData.start
                      .toString()
                      .slice(0, 10)} ${bookingData.start
                      .toString()
                      .slice(11, 16)}`}</p>
                  </div>
                  <div>
                    <p>Duration</p>
                    <p>{`${
                      new Date(bookingData.end).getHours() -
                      new Date(bookingData.start).getHours()
                    } ${
                      new Date(bookingData.end).getHours() -
                        new Date(bookingData.start).getHours() ===
                      1
                        ? "hour"
                        : "hours"
                    }`}</p>
                  </div>
                  <div>
                    <p>Amount paid</p>
                    <p>
                      {bookingData.price}
                      <Image
                        alt="parcoin icon"
                        src={parcoinIcon}
                        height={16}
                        width={16}
                      />
                    </p>
                  </div>
                </section>
                {driverData && (
                  <section>
                    <h4>Driver information</h4>
                    <div>
                      <p>Driver username</p>
                      <p>{driverData?.username}</p>
                    </div>
                    <div>
                      <p>Rating</p>
                      <p>
                        <StarRating rating={driverData.rating} />
                      </p>
                    </div>
                    <div>
                      <p>Vehicle model</p>
                      <p>{driverData.vehicleModel}</p>
                    </div>
                    <div>
                      <p>License plate</p>
                      <p>{driverData.licensePlate}</p>
                    </div>
                  </section>
                )}
              </UiBox>
              <UiBox className={styles.bookingReview}>
                {user.user?.id === driverData?.id && <h4>Review parking</h4>}
                {user.user?.id === spotData?.id && <h4>Review parking</h4>}
              </UiBox>
              <UiBox className={styles.bookingReport}>Report</UiBox>
            </section>
          )}
        </div>
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
      </main>
    </DashboardWrapper>
  );
};

export default Booking;
