import styles from "./CreateProfile.module.scss";
import { InputField } from "../FormElements/InputField/InputField";
import { api } from "~/utils/api";
import { type SubmitHandler, useForm } from "react-hook-form";
import type { inferRouterInputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
export type InputInfo<T> = {
  value: T;
  error?: string;
};

type RouterInput = inferRouterInputs<AppRouter>;
type CreateProfileInput = RouterInput["profile"]["create"];

const CreateProfile: React.FC = () => {
  const { register, handleSubmit } = useForm<CreateProfileInput>();
  const { mutate, isLoading: isPosting } = api.profile.create.useMutation({});
  const onSubmit: SubmitHandler<CreateProfileInput> = (data) => {
    console.log(data);
    mutate(data);
  };
  return (
    <>
      <div className={styles.form}>
        <h1>Create your profile</h1>
        <p>Complete your profile so you can start using the app</p>
        {/*eslint-disable-next-line */}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.inputFields}>
          <InputField
            name="firstname"
            label="First name"
            inputType="text"
            placeholder="First Name"
            register={register}
          />
          <InputField
            name="lastName"
            label="Last name"
            inputType="text"
            placeholder="Last Name"
            register={register}
          />
          <InputField
            name="username"
            label="Username"
            inputType="text"
            placeholder="Username"
            register={register}
          />
          <InputField
            name="phoneNumber"
            label="Phone number"
            inputType="text"
            placeholder="Phone number"
            register={register}
          />
          <InputField
            name="isDriver"
            label="Do you drive?"
            inputType="checkbox"
            placeholder=""
            register={register}
          />
          <InputField
            name="isOwner"
            label="Do you drive?"
            inputType="checkbox"
            placeholder=""
            register={register}
          />
          <input type="submit" />
        </form>
      </div>
    </>
  );
};
export default CreateProfile;
