import { type ParkingSpot } from "../MapComponent/utils";
import styles from "./ParkingSpotCard.module.scss";
import { Button } from "../button/button";

type ParkingSpotCardProps = {
  spot: ParkingSpot;
};

export const ParkingSpotCard = ({ spot }: ParkingSpotCardProps) => {
  console.log(spot.features);
  return (
    <div className={styles.card}>
      <div className={styles.cardImage}></div>
      <div className={styles.cardContents}>
        <h4>{spot.address}</h4>
        <div className={styles.cardContentsInfo}>
          <span>{`RATING: ${spot.rating ? spot.rating : `no ratings`}`}</span>
          <span>{`BOOKINGS: ${spot._count.Booking}`}</span>
        </div>
        <div className={styles.cardContentsFeats}>
          {spot?.features.map((spot, index) => (
            <p key={index}>{spot}</p>
          ))}
        </div>
        <Button
          text={`Book for ${spot.price}`}
          type="primary"
          onClick={() => console.log("booked for", spot.price)}
        ></Button>
      </div>
    </div>
  );
};
