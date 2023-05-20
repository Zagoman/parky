import { api } from "~/utils/api"
import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Head from "next/head"

const CreateParkingPage: NextPage<{ username: string }> = ({ username }) => {
  const profile = api.profile.getProfileByUsername.useQuery({
    username: username,
  })
  console.log(profile)
  return (
    <>
      <Head>
        <title>Parky | Easy parking everywhere</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <CreateParking />
      </main>
    </>
  )
}
import { createServerSideHelpers } from "@trpc/react-query/server"
import { appRouter } from "~/server/api/root"
import { prisma } from "~/server/db"
import SuperJSON from "superjson"
import { TRPCError } from "@trpc/server"
import CreateParking from "./components/CreateParking"

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: SuperJSON, // optional - adds superjson serialization
  })
  const username = context.params?.username
  if (typeof username !== "string") {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No user's with this username have been found",
    })
  }

  await helpers.profile.getProfileByUsername.prefetch({ username })
  return {
    props: {
      trpcState: helpers.dehydrate(),
      username,
    },
  }
}

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" }
}
export default CreateParkingPage