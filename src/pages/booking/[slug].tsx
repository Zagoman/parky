/* eslint-disable @typescript-eslint/restrict-template-expressions */
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
import { toast } from "react-hot-toast";
import { InputField } from "~/components/FormElements/InputField/InputField";

import { useForm } from "react-hook-form";

const Booking: NextPage = () => {
  const [bookingId, setBookingId] = useState("");
  const [bookingData, setBookingData] = useState<BookingElement>();
  const [driverId, setDriverId] = useState("");
  const [spotId, setSpotId] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const user = useUser();

  const router = useRouter();
  const { data, refetch, isLoading } = api.booking.getBookingById.useQuery({
    bookingId: bookingId,
  });

  const {
    data: driverData,
    refetch: refetchDriver,
    isLoading: isLoadingDriver,
  } = api.profile.getProfileById.useQuery({
    id: driverId,
  });

  const { data: spotData, refetch: refetchSpot } =
    api.parking.getParkingById.useQuery({
      id: spotId,
    });

  const parcoinIcon = parcoinImport as unknown as string;

  const { mutate: createParkingReview } = api.parkingReview.create.useMutation({
    onSuccess: () => toast.success("Review submitted"),
    onError: () => toast.error("Error submitting the review"),
  });

  const { mutate: createDriverReview } = api.profileReview.create.useMutation({
    onSuccess: () => toast.success("Review submitted"),
    onError: () => toast.error("Error submitting the review"),
  });

  const { register, watch, getValues, setValue } = useForm<{
    driverRating: number;
    driverComment: string;
    parkingRating: number;
    parkingComment: string;
  }>({
    defaultValues: {
      driverRating: undefined,
      driverComment: "",
      parkingRating: undefined,
      parkingComment: "",
    },
  });

  useEffect(() => {
    if (router.query.slug && !bookingId) {
      const id: string | string[] = router.query.slug;
      if (typeof id === "string") {
        setBookingId(id);
        void refetch();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.slug]);

  useEffect(() => {
    if (!isLoading && data) {
      const fetchedData = data as unknown as BookingElement;
      setBookingData(fetchedData);
    }
  }, [isLoading, data]);

  useEffect(() => {
    if (
      !isLoading &&
      bookingData &&
      bookingData.profileId &&
      bookingData.parkingId &&
      !spotId
    ) {
      setDriverId(bookingData.profileId);
      setSpotId(bookingData.parkingId);
      void refetchDriver();
      void refetchSpot();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingData]);

  useEffect(() => {
    if (isModalVisible) {
      const timer = setTimeout(() => {
        setIsModalVisible(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isModalVisible]);

  return (
    <DashboardWrapper active={"bookings"}>
      <main className={styles.main}>
        <div>
          {isLoading && <div>Loader</div>}
          {!isLoading &&
          bookingData &&
          (user?.user?.id === bookingData?.profileId ||
            user?.user?.id === spotData?.id) ? (
            <section className={styles.booking}>
              <div className={styles.bookingHeader}>
                <h2>{`Booking #${bookingData.bookingNumber}`}</h2>
                <Link href="/account/bookings">Back</Link>
              </div>
              <UiBox className={styles.bookingDetails}>
                <section>
                  <h4>Order information</h4>
                  <div>
                    <p>Parking name</p>
                    <p>{spotData?.address}</p>
                  </div>
                  <div>
                    <p>Parking rating</p>
                    <p>
                      <StarRating
                        rating={spotData?.rating ? spotData.rating : "no data"}
                      />
                    </p>
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
                {driverData && !isLoadingDriver && (
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
                {/* parking review */}
                {user.user?.id === driverData?.id && (
                  <form
                    onSubmit={() => {
                      event?.preventDefault();
                      const rating = getValues("parkingRating");
                      if (
                        driverData?.id &&
                        spotData?.id &&
                        rating &&
                        rating > 0 &&
                        rating <= 5
                      ) {
                        createParkingReview({
                          rating: rating,
                          content: getValues("parkingComment"),
                          parkingId: spotData?.id,
                        });
                      }
                      setValue("parkingComment", "");
                      setValue("parkingRating", 3);
                    }}
                  >
                    <h4>Review parking</h4>
                    <p>
                      Please review the experience you on this parking spot.
                    </p>
                    <section>
                      <div>
                        <div className={styles.ratingWrapper}>
                          <InputField
                            inputType="number"
                            name="parkingRating"
                            placeholder="Parking rating"
                            label="Parking rating"
                            register={register}
                            min="1"
                            max="5"
                            error={
                              watch("parkingRating") <= 0 ||
                              watch("parkingRating") > 5
                                ? "Please input correct rating (1-5)"
                                : undefined
                            }
                            required
                          />
                          <StarRating rating={watch("parkingRating")} />
                        </div>
                        <label
                          htmlFor="driverComment"
                          className={styles.textarea}
                        >
                          Comment*
                          <textarea
                            id="parkingComment"
                            rows={10}
                            cols={50}
                            {...register("parkingComment")}
                            placeholder="Comments about parking spot"
                          ></textarea>
                        </label>
                        <input
                          type="submit"
                          value="Submit review"
                          className={styles.primary}
                          disabled={
                            spotData?.id &&
                            watch("parkingRating") > 0 &&
                            watch("parkingRating") <= 5
                              ? false
                              : true
                          }
                        />
                      </div>
                    </section>
                  </form>
                )}
                {user.user?.id === spotData?.profileId && (
                  // driver review
                  <form
                    onSubmit={() => {
                      event?.preventDefault();
                      const rating = getValues("driverRating");
                      if (
                        driverData?.id &&
                        spotData?.id &&
                        rating &&
                        rating > 0 &&
                        rating <= 5
                      ) {
                        createDriverReview({
                          rating: rating,
                          profileId: driverData?.id,
                          content: getValues("driverComment"),
                          parkingId: spotData?.id,
                        });
                      }

                      setValue("driverComment", "");
                      setValue("driverRating", 3);
                    }}
                  >
                    <h4>Review Driver</h4>
                    <p>
                      Please review the experience you had with this driver.
                    </p>
                    <section>
                      <div>
                        <div className={styles.ratingWrapper}>
                          <InputField
                            inputType="number"
                            name="driverRating"
                            placeholder="Driver rating"
                            label="Driver rating"
                            register={register}
                            min="1"
                            max="5"
                            error={
                              watch("driverRating") <= 0 ||
                              watch("driverRating") > 5
                                ? "Please input correct rating (1-5)"
                                : undefined
                            }
                            required
                          />
                          <StarRating rating={watch("driverRating")} />
                        </div>
                        <label
                          htmlFor="driverComment"
                          className={styles.textarea}
                        >
                          Comment*
                          <textarea
                            id="driverComment"
                            rows={10}
                            cols={50}
                            {...register("driverComment")}
                            placeholder="Comments about driver"
                          ></textarea>
                        </label>
                        <input
                          type="submit"
                          value="Submit review"
                          className={styles.primary}
                          disabled={
                            driverData?.id &&
                            spotData?.id &&
                            watch("driverRating") > 0 &&
                            watch("driverRating") <= 5
                              ? false
                              : true
                          }
                        />
                      </div>
                    </section>
                  </form>
                )}
              </UiBox>
              <UiBox className={styles.bookingReport}>
                {user.user?.id === driverData?.id && (
                  <section className={styles.reportWrapper}>
                    <h4>Report parking</h4>
                    <span>
                      <p>If there was a problem with the parking spot</p>
                      <p onClick={() => setIsModalVisible(true)}>
                        <div
                          className={
                            isModalVisible
                              ? `${styles.reportModal}`
                              : `${styles.reportModal} ${styles.modalHidden}`
                          }
                        >
                          <UiBox>
                            <p className={styles.modalMessage}>
                              Currently unavailable
                            </p>
                          </UiBox>
                        </div>
                        Submit a report here.
                      </p>
                    </span>
                  </section>
                )}
                {user.user?.id === spotData?.profileId && (
                  <section className={styles.reportWrapper}>
                    <h4>Report Driver here.</h4>
                    <span>
                      <p>If there was a problem with the driver</p>
                      <p onClick={() => setIsModalVisible(true)}>
                        <div
                          className={
                            isModalVisible
                              ? `${styles.reportModal}`
                              : `${styles.reportModal} ${styles.modalHidden}`
                          }
                        >
                          <UiBox>
                            <p className={styles.modalMessage}>
                              Currently unavailable
                            </p>
                          </UiBox>
                        </div>
                        Submit a report
                      </p>
                    </span>
                  </section>
                )}
              </UiBox>
            </section>
          ) : (
            <>
              <h2>ACCESS DENIED</h2>
            </>
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
