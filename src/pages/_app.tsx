import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { api } from "~/utils/api";
import "~/styles/globals.scss";
import { Toaster } from "react-hot-toast";
import styles from "./index.module.scss";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        toastOptions={{
          className: styles.toast,
          style: {
            border: "1px solid #a2adb9",
            padding: "16px",
            color: "#10171d",
          },
        }}
        containerStyle={{
          bottom: 20,
          zIndex: 1000000,
        }}
      />
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
