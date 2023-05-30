/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import styles from "./ParkingSpotCard.module.scss";
import { Button } from "../button/button";
import Image from "next/image";
import { StarRating } from "../StarRating/StarRating";
import calendarIcon from "../../../public/icon/calendar.svg";
import parkcoin from "../../../public/icon/parkcoin.svg";
import { SpotFeatures } from "./components/SpotFeatures";
import type { RouterOutputs } from "~/utils/api";
import { useUser } from "@clerk/nextjs";

type ParkingSpotCardProps = {
  spot: RouterOutputs["parking"]["getParkingWithinRange"][0];
  onClick: (spotId: string, spotPrice: number) => void;
  isUserDataLoaded: boolean;
  active: boolean;
};

export const ParkingSpotCard = ({
  spot,
  onClick,
  isUserDataLoaded,
  active,
}: ParkingSpotCardProps) => {
  const user = useUser();

  return (
    <div
      className={active ? `${styles.card} ${styles.activeCard}` : styles.card}
    >
      <div className={styles.cardImage}>
        {spot.imageURL ? (
          <Image
            src={spot.imageURL}
            alt={spot.address}
            width={200}
            height={200}
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            fill="#a2adb9"
            viewBox="0 0 16 16"
          >
            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
          </svg>
        )}
      </div>
      <div className={styles.cardContents}>
        <h4>{spot.address}</h4>
        <div className={styles.cardContentsInfo}>
          <span>
            <StarRating rating={spot.rating ? spot.rating : "no ratings"} />
          </span>
          <span>
            <Image
              src={calendarIcon}
              alt="calendar icon"
              height={16}
              width={16}
            />
            {`${spot["_count"].Booking} bookings`}
          </span>
        </div>
        <div className={styles.cardContentsFeats}>
          <SpotFeatures features={spot.features as string[]} />
        </div>
        <Button
          text={
            user.isSignedIn
              ? `Book for ${spot.price}`
              : `Sign in to book for ${spot.price}`
          }
          type="primary"
          onClick={() => {
            onClick(spot.id, spot.price);
          }}
          icon={parkcoin}
          isDisabled={
            user.isLoaded && user.isSignedIn && isUserDataLoaded ? false : true
          }
        />
      </div>
    </div>
  );
};
