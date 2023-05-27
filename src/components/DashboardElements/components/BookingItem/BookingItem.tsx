/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { api } from "~/utils/api"
import { useEffect, useState } from "react"
import parkingIconImport from "../../../../../public/icon/parking.svg"
import detailsIconImport from "../../../../../public/icon/details.svg"
import parcoinIconImport from "../../../../../public/icon/parkcoin-filled.svg"

import Link from "next/link"
import Image from "next/image"
import styles from "./BookingItem.module.scss"

export type BookingElement = {
  id: string
  bookingNumber: string
  profileId: string
  parkingId: string
  start: Date
  end: Date
  price: number
  type: null | string
  status: string
  createdAt: Date
  updatedAt: Date
}

type BookingItemProps = {
  booking: BookingElement
}

export const BookingItem = ({ booking }: BookingItemProps) => {
  const { data } = api.parking.getParkingById.useQuery({
    id: booking.parkingId,
  })
  const parkingIcon = parkingIconImport as unknown as string
  const detailsIcon = detailsIconImport as unknown as string
  const parcoinIcon = parcoinIconImport as unknown as string

  return booking && data ? (
    <li className={styles.item}>
      <section>
        <Image src={parkingIcon} alt="parking icon" height={32} width={32} />
        <div>
          <div className={styles.itemHeader}>
            <p>{data.address}</p>
          </div>
          <div className={styles.itemSubInfo}>
            <p>{booking.start.toISOString().slice(0, 10)}</p>
            <p>
              {`${booking.start.toISOString().slice(11, 16)} ${
                booking.end.getHours() - booking.start.getHours()
              } ${
                booking.end.getHours() - booking.start.getHours() === 1
                  ? "hour"
                  : "hours"
              }`}
            </p>
            <p></p>
          </div>
        </div>
      </section>

      <div className={styles.itemPrice}>
        <div>
          <p>{booking.price}</p>
          <Image src={parcoinIcon} alt="parcoin icon" width={24} height={24} />
        </div>
      </div>

      <div className={styles.itemDetails}>
        <Link href={`/booking/${booking.id}`}>
          <Image src={detailsIcon} alt="details icon" />
        </Link>
      </div>
    </li>
  ) : (
    <></>
  )
}
