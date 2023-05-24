import { useUser } from "@clerk/nextjs"
import styles from "./index.module.scss"
import type { NextPage } from "next"
import Head from "next/head"
import { api } from "~/utils/api"
import { toast } from "react-hot-toast"

const Test: NextPage = () => {
  const user = useUser()
  const { mutate: cancel } = api.booking.cancelBooking.useMutation({
    onSuccess: () => toast.success("Booking canceled succesfully"),
  })
  const { mutate: create } = api.booking.create.useMutation({
    onSuccess: () => toast.success("booking create"),
  })
  const bookParking = () => {
    create({
      price: 200,
      end: new Date(Date.now()).toISOString(),
      driverId: "user_2P7PXIXl7M2nwYluYFo7y0Pka1m",
      parkingId: "clhulkwe80000uwl2zknh11s0",
      start: new Date(Date.now()).toISOString(),
    })
  }
  const cancelParking = () => {
    cancel({
      bookingNumber: "1684692120865",
    })
  }

  return (
    <>
      <Head>
        <title>Login | Parky</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {/*eslint-disable-next-line */}
        <button onClick={() => bookParking()}> Book parking </button>
        <button onClick={() => cancelParking()}> Cancel parking </button>
      </main>
    </>
  )
}

export default Test
