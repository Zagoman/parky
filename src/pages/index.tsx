import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import styles from "./index.module.css";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

const Home: NextPage = () => {
    const hello = api.example.hello.useQuery({ text: "from tRPC" });
    const user = useUser()
    return (
        <>
            <Head>
                <title>Create T3 App</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                {!user.isSignedIn &&
                    <SignInButton></SignInButton>
                }
                {!!user.isSignedIn &&
                <SignOutButton></SignOutButton>

                }


                <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />

            </main>
        </>
    );
};

export default Home;
