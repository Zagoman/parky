/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { type NextPage } from "next"
import { useUser } from "@clerk/nextjs"
import Head from "next/head"
import { DashboardWrapper } from "~/components/DashboardWrapper/DashboardWrapper"
import { useRouter } from "next/router"
import { type RouterInputs, type RouterOutputs, api } from "~/utils/api"
import { SubmitHandler, useForm } from "react-hook-form"
import { useEffect } from "react"
import { PhoneNumber } from "@clerk/nextjs/dist/api"
import { InputField } from "~/components/FormElements/InputField/InputField"
type Something = RouterOutputs["profile"]["getProfileById"]
const Home: NextPage = () => {
  const router = useRouter()
  const { handleSubmit, register, watch, setValue } =
    useForm<RouterInputs["profile"]["update"]>()
  const { data: userId, isFetching: userFetching } =
    api.user.getUserId.useQuery()
  const profile = api.profile.getProfileById.useQuery(
    //eslint-disable-next-line
    { id: userId ? userId : "" },
    {
      enabled: !!userId,
      onSuccess: (el: RouterOutputs["profile"]["getProfileById"]) => {
        setValue("lastName", el.lastName)
        setValue("firstName", el.firstName)
        setValue("isOwner", el.isOwner ? true : false)
        setValue("isDriver", el.isDriver ? true : false)
        setValue("username", el.username)
        setValue("phoneNumber", el.phoneNumber ? el.phoneNumber : "")
        setValue("vehicleSize", el.vehicleSize ? el.vehicleSize : undefined)
        setValue("vehicleModel", el.vehicleModel ? el.vehicleModel : undefined)
        setValue("licensePlate", el.licensePlate ? el.licensePlate : undefined)
      },
    }
  )
  if (profile.isFetching || userFetching) {
    return (
      <>
        <Head>
          <title>Bookings | Parky</title>
          <meta name="Bookings page" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.svg" />
        </Head>
        <DashboardWrapper active="accountsettings">
          <h2>Loading...</h2>
        </DashboardWrapper>
      </>
    )
  }
  if (!userFetching && !userId) {
    void router.push("/")
    return <></>
  }

  const onSubmit: SubmitHandler<RouterInputs["profile"]["update"]> = (data) => {
    return
  }

  return (
    <>
      <Head>
        <title>Bookings | Parky</title>
        <meta name="Bookings page" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <DashboardWrapper active="accountsettings">
        <form
          //eslint-disable-next-line
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputField
            register={register}
            name="firstName"
            label="First name"
            error=""
            inputType="text"
            placeholder=""
          />
          <InputField
            register={register}
            name="lastName"
            label="Last name"
            error=""
            inputType="text"
            placeholder=""
          />
          <InputField
            register={register}
            name="username"
            label="Username"
            error=""
            inputType="text"
            placeholder=""
          />
          <InputField
            register={register}
            name="phoneNumber"
            label="Phone number"
            error=""
            inputType="text"
            placeholder=""
          />
          <InputField
            register={register}
            name="isOwner"
            label="Do you own a parking spot?"
            error=""
            inputType="checkbox"
            placeholder=""
          />
          <InputField
            register={register}
            name="isDriver"
            label="Do you drive?"
            error=""
            inputType="checkbox"
            placeholder=""
          />
        </form>
      </DashboardWrapper>
    </>
  )
}

export default Home
