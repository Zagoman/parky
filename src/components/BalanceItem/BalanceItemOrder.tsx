/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { type CoinOrder } from "@prisma/client";
import styles from "./BalanceItem.module.scss";
import parcoinImport from "../../../public/icon/parkcoin-filled.svg";
import Image from "next/image";

type BalanceItemProps = CoinOrder;

export const BalanceItemOrder = (item: BalanceItemProps) => {
  const parcoinIcon = parcoinImport as unknown as string;

  return (
    <li className={styles.wrapper}>
      <div className={styles.wrapperHeader}>
        <Image src={parcoinIcon} alt="booking icon" width={24} height={24} />
        <span>
          <p>Coin order</p>
          <p>{`ID: #${item.id}`}</p>
        </span>
      </div>
      <p>{item.createdAt.toISOString().slice(0, 10)}</p>
      <p className={styles.wrapperAmount}>
        {`+ ${item.amount}`}{" "}
        <Image src={parcoinIcon} alt="booking icon" width={18} height={18} />
      </p>
    </li>
  );
};
