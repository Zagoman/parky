import { SignInButton, useUser } from "@clerk/nextjs"
import styles from "./create.module.scss"
import { type NextPage } from "next"
import Head from "next/head"
import CreateProfile from "~/components/CreateProfile/CreateProfile"
import { api } from "~/utils/api"
import Link from "next/link"
import { UiBox } from "~/components/uiBox/uiBox"

const CreateProfilePage: NextPage = () => {
  const { user, isSignedIn, isLoaded } = useUser()
  const profile = user
    ? api.profile.getProfileById.useQuery({ id: user.id })
    : undefined
  if (!isLoaded) {
    return <div>Loading...</div>
  }
  if (isSignedIn && !profile?.data?.id) {
    return (
      <>
        <Head>
          <title>Create profile | Parky</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <div className={styles.container}>
            <UiBox className={styles.ui}>
              <div></div>
              <CreateProfile />
            </UiBox>
          </div>
        </main>
      </>
    )
  }

  if (isSignedIn && profile?.data?.id) {
    return (
      <div>
        <h1>You already have a profile at Parky</h1>
        <Link href={"/"}>Go back home</Link>
      </div>
    )
  }
  return (
    <div>
      <h1>You need to sign up first</h1>
      <SignInButton redirectUrl="/profile/create" />
      <Link href={"/"}>Go back home</Link>
    </div>
  )
}
export default CreateProfilePage
