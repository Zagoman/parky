/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { type Booking } from "@prisma/client";
import styles from "./BalanceItem.module.scss";
import bookingImport from "../../../public/icon/calendar.svg";
import Image from "next/image";
import parcoinImport from "../../../public/icon/parkcoin-filled.svg";

type BalanceItemProps = Booking;

export const BalanceItemBooking = (item: BalanceItemProps) => {
  const bookingIcon = bookingImport as unknown as string;
  const parcoinIcon = parcoinImport as unknown as string;

  return (
    <li className={styles.wrapper}>
      <div className={styles.wrapperHeader}>
        <Image src={bookingIcon} alt="booking icon" width={24} height={24} />
        <span>
          <p>Parking booking</p>
          <p>{`ID: #${item.id}`}</p>
        </span>
      </div>
      <p>{item.createdAt.toISOString().slice(0, 10)}</p>
      <p className={styles.wrapperAmount}>
        {`- ${item.price}`}
        <Image src={parcoinIcon} alt="booking icon" width={18} height={18} />
      </p>
    </li>
  );
};
