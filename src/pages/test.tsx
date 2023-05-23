import { useUser } from "@clerk/nextjs"
import styles from "./index.module.scss"
import type { NextPage } from "next"
import Head from "next/head"
import { RouterInputs, api } from "~/utils/api"
import { InputField } from "~/components/FormElements/InputField/InputField"
import { type SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"

const Test: NextPage = () => {
  const user = useUser()
  const { mutate: addCoin, error } = api.coin.addCoin.useMutation({
    onSuccess: () => {
      toast.success("transaction complete")
    },
    onError: (e) => {
      if (!e.data?.zodError) toast.error(e.message)
    },
  })
  const { register, handleSubmit } = useForm<RouterInputs["coin"]["addCoin"]>()

  const onSubmit: SubmitHandler<RouterInputs["coin"]["addCoin"]> = (data) => {
    console.log(data)
    console.log("outside")
    if (user.user) {
      console.log("insider")
      addCoin({ ...data, toAccountId: user.user.id })
    }
  }
  if (!user.isLoaded) {
    return <div>Loading</div>
  }

  return (
    <>
      <Head>
        <title>Login | Parky</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {/*eslint-disable-next-line */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            register={register}
            name="amount"
            label="Purchase amount"
            inputType="number"
            placeholder=""
            error={error?.data?.zodError?.fieldErrors["amount"]?.at(0)}
          />
          <input type="submit" />
        </form>
      </main>
    </>
  )
}

export default Test
