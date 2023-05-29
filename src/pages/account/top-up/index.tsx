import { type NextPage } from "next";
import { DashboardWrapper } from "~/components/DashboardWrapper/DashboardWrapper";
import { type RouterInputs, api } from "~/utils/api";
import toast from "react-hot-toast";
import { type SubmitHandler, useForm } from "react-hook-form";
import styles from "./index.module.scss";
import { useUser } from "@clerk/nextjs";
import { InputField } from "~/components/FormElements/InputField/InputField";
import { DashboardFooter } from "~/components/DashboardElements/components/DashboardFooter/DashboardFooter";
import Link from "next/link";
import { UiBox } from "~/components/uiBox/uiBox";

const TopUp: NextPage = () => {
  const user = useUser();
  const { mutate: addCoin } = api.coin.addCoin.useMutation({
    onSuccess: () => {
      toast.success("Transaction complete");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  const { register, handleSubmit, watch } =
    useForm<RouterInputs["coin"]["addCoin"]>();

  const onSubmit: SubmitHandler<RouterInputs["coin"]["addCoin"]> = (data) => {
    if (user.user) {
      addCoin({ ...data, toAccountId: user.user.id });
    }
  };

  return (
    <>
      <DashboardWrapper active="top-up">
        <>
          <div className={styles.contentWrapper}>
            <h2>Account top up</h2>
            <UiBox className={styles.formWrapper}>
              <h4>Purchase ParCoin</h4>
              <p>
                To top up your account please select the amount of ParCoin and
                proceed.
              </p>
              {/*eslint-disable-next-line */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <InputField
                  register={register}
                  name="amount"
                  label="Purchase amount"
                  inputType="number"
                  placeholder="Insert coin amount"
                  min={1}
                  error={
                    watch("amount") < 1 ? "Please insert a valid amount." : ""
                  }
                />
                <input
                  type="submit"
                  className={styles.primary}
                  value="Proceed"
                  disabled={user.isLoaded ? false : true}
                />
              </form>
            </UiBox>
            <UiBox>
              <h4>Having trouble?</h4>
              <p>
                If you run into any problems with the top up processs, please{" "}
                <Link href="/contact">Contact us</Link>.
              </p>
            </UiBox>
            <UiBox className={styles.quickAccess}>
              <h4>Quick access</h4>
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/map">Book a parking spot</Link>
                </li>
                <li>
                  <Link href="/get-benefits">Get benefits</Link>
                </li>
                <li>
                  <Link href="/balance">Balance overview</Link>
                </li>
              </ul>
            </UiBox>
            <DashboardFooter>
              <ul>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
                <li>
                  <Link href="/help">Help</Link>
                </li>
              </ul>
            </DashboardFooter>
          </div>
        </>
      </DashboardWrapper>
    </>
  );
};

export default TopUp;