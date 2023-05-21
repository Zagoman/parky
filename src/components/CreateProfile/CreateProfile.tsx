import styles from "./CreateProfile.module.scss"
import { InputField } from "../FormElements/InputField/InputField"
import { type RouterInputs, type RouterOutputs, api } from "~/utils/api"
import { type SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"

type CreateProfileInput = RouterInputs["profile"]["create"]

type CreateProfileProps = {
  update?: boolean
  profile?: RouterOutputs["profile"]["getProfileByUsername"]
}

const CreateProfile: React.FC<CreateProfileProps> = (props) => {
  const { update = false, profile } = props
  const { register, handleSubmit, watch } = useForm<CreateProfileInput>({
    defaultValues: {
      isDriver:
        update && profile && profile?.isDriver !== null
          ? profile.isDriver
          : false,
      isOwner:
        update && profile && profile?.isOwner !== null
          ? profile.isOwner
          : false,
      firstName: update && profile ? profile.firstName : undefined,
      lastName: update && profile ? profile.lastName : undefined,
      vehicleSize:
        update && profile?.vehicleSize ? profile.vehicleSize : undefined,
      username: update && profile ? profile.username : undefined,
      phoneNumber:
        update && profile?.phoneNumber ? profile.phoneNumber : undefined,
      licensePlate:
        update && profile?.licensePlate ? profile.licensePlate : undefined,
      vehicleModel:
        update && profile && profile.vehicleModel !== null
          ? profile.vehicleModel
          : undefined,
    },
  })
  const { mutate, error } = update
    ? api.profile.update.useMutation({
        onSuccess: () => {
          toast.success("Profile updated succesfully")
        },
      })
    : api.profile.create.useMutation({
        onSuccess: () => {
          toast.success("Profile created succesfully")
        },
      })
  const isDriver = watch("isDriver")
  const onSubmit: SubmitHandler<CreateProfileInput> = (data) => {
    mutate(data)
  }
  return (
    <>
      <div className={styles.form}>
        <h1>{update ? "Update your profile" : "Create your profile"}</h1>
        {!update && <p>Complete your profile so you can start using the app</p>}
        {/*eslint-disable-next-line */}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.inputFields}>
          <InputField
            name="firstName"
            label="First name"
            inputType="text"
            placeholder="First Name"
            register={register}
            error={error?.data?.zodError?.fieldErrors["firstName"]?.at(0)}
          />
          <InputField
            name="lastName"
            label="Last name"
            inputType="text"
            placeholder="Last Name"
            register={register}
            error={error?.data?.zodError?.fieldErrors["lastName"]?.at(0)}
          />
          <InputField
            name="username"
            label="Username"
            inputType="text"
            placeholder="Username"
            register={register}
            error={error?.data?.zodError?.fieldErrors["username"]?.at(0)}
          />
          <InputField
            name="phoneNumber"
            label="Phone number"
            inputType="text"
            placeholder="Phone number"
            register={register}
            error={error?.data?.zodError?.fieldErrors["phoneNumber"]?.at(0)}
          />
          <InputField
            name="isDriver"
            label="Do you drive?"
            inputType="checkbox"
            placeholder=""
            register={register}
            error={error?.data?.zodError?.fieldErrors["isDriver"]?.at(0)}
          />
          <InputField
            name="isOwner"
            label="Do you own a parking spot?"
            inputType="checkbox"
            placeholder=""
            register={register}
            error={error?.data?.zodError?.fieldErrors["isOwner"]?.at(0)}
          />
          {isDriver && (
            <>
              <InputField
                name="licensePlate"
                label="What is your vehicle's license plate?"
                inputType="text"
                register={register}
                placeholder="License plate"
                error={error?.data?.zodError?.fieldErrors["licensePlate"]?.at(
                  0
                )}
              />
              <InputField
                name="vehicleModel"
                label="What is your vehicle's model?"
                inputType="text"
                placeholder="Vehicle model"
                register={register}
                error={error?.data?.zodError?.fieldErrors["vehicleModel"]?.at(
                  0
                )}
              />
              <select {...register("vehicleSize")}>
                <option value="XSMALL">X-Small</option>
                <option value="SMALL">Small</option>
                <option value="MEDIUM">Medium</option>
                <option value="LARGE">Large</option>
                <option value="XLARGE">X-Large</option>
              </select>
            </>
          )}
          <input type="submit" />
        </form>
      </div>
    </>
  )
}
export default CreateProfile
