import { useState } from "react"
import styles from "./CreateProfile.module.scss"
import { InputField } from "../FormElements/InputField/InputField"
import { Checkbox } from "../FormElements/CheckBox/Checkbox"
import { api } from "~/utils/api"
import { toast } from "react-hot-toast"
import { Sizes } from "@prisma/client"
import SelectField from "../FormElements/SelectField/SelectField"
export type InputInfo<T> = {
  value: T
  error?: string
}
const CreateProfile: React.FC = () => {
  const [firstName, setFirstName] = useState<InputInfo<string>>({ value: "" })
  const [lastName, setLastName] = useState<InputInfo<string>>({ value: "" })
  const [username, setUsername] = useState<InputInfo<string>>({ value: "" })
  const [phoneNumber, setPhoneNumber] = useState<InputInfo<string>>({
    value: "",
  })
  const [isDriver, setIsDriver] = useState<InputInfo<boolean>>({ value: false })
  const [isOwner, setIsOwner] = useState<InputInfo<boolean>>({ value: false })
  const [licensePlate, setLicensePlate] = useState<InputInfo<string>>({
    value: "",
  })
  const [vehicleModel, setVehicleModel] = useState<InputInfo<string>>({
    value: "",
  })
  const [vehicleSize, setVehicleSize] = useState<InputInfo<Sizes | string>>({
    value: "",
  })
  //    const [vehicleSize, setVehicleSize] = useState()
  const { mutate, isLoading: isPosting } = api.profile.create.useMutation({
    onSuccess: () => {
      setFirstName({ value: "" })
      setLastName({ value: "" })
      setIsOwner({ value: false })
      setIsDriver({ value: false })
      setPhoneNumber({ value: "" })
      setUsername({ value: "" })
      setVehicleModel({ value: "" })
      setLicensePlate({ value: "" })
    },
    onError: (e) => {
      const errorMessages = e.data?.zodError?.fieldErrors
      if (errorMessages) {
        for (const key in errorMessages) {
          switch (key) {
            case "firstName":
              setFirstName((old) => ({
                ...old,
                error: errorMessages["firstName"]?.at(0),
              }))
              break
            case "lastName":
              setLastName((old) => ({
                ...old,
                error: errorMessages["lastName"]?.at(0),
              }))
              break
            case "isOwner":
              setIsOwner((old) => ({
                ...old,
                error: errorMessages["isOwner"]?.at(0),
              }))
              break
            case "isDriver":
              setIsDriver((old) => ({
                ...old,
                error: errorMessages["isDriver"]?.at(0),
              }))
              break
            case "phoneNumber":
              setPhoneNumber((old) => ({
                ...old,
                error: errorMessages["phoneNumber"]?.at(0),
              }))
              break
            case "username":
              setUsername((old) => ({
                ...old,
                error: errorMessages["username"]?.at(0),
              }))
              break
            case "vehicleModel":
              setVehicleModel((old) => ({
                ...old,
                error: errorMessages["vehicleModel"]?.at(0),
              }))
              break
            case "licensePlate":
              setLicensePlate((old) => ({
                ...old,
                error: errorMessages["licensePlate"]?.at(0),
              }))
              break
          }
        }
        return
      }
      toast.error("Invalid submission, please try again")
    },
  })
  const submitForm = () => {
    setUsername({ value: username.value })
    setPhoneNumber({ value: phoneNumber.value })
    setIsDriver({ value: isDriver.value })
    setIsOwner({ value: isOwner.value })
    setFirstName({ value: firstName.value })
    setLastName({ value: lastName.value })
    setLicensePlate({ value: lastName.value })
    setVehicleModel({ value: lastName.value })

    mutate({
      firstName: firstName.value,
      lastName: lastName.value,
      isOwner: isOwner.value,
      isDriver: isDriver.value,
      phoneNumber: phoneNumber.value,
      username: username.value,
      ...(isDriver && {
        licensePlate: licensePlate.value,
        vehicleModel: vehicleModel.value,
      }),
    })
  }

  return (
    <>
      <div className={styles.form}>
        <h1>Create your profile</h1>
        <p>Complete your profile so you can start using the app</p>
        <div className={styles.inputFields}>
          <InputField
            name="firstname"
            label="First name"
            inputType="text"
            value={firstName.value}
            onChange={setFirstName}
            placeholder="First Name"
            error={firstName.error}
          />
          <InputField
            name="lastName"
            label="Last name"
            inputType="text"
            value={lastName.value}
            onChange={setLastName}
            placeholder="Last Name"
            error={lastName.error}
          />
          <InputField
            name="username"
            label="Username"
            inputType="text"
            value={username.value}
            onChange={setUsername}
            placeholder="Username"
            error={username.error}
          />
          <InputField
            name="phoneNumber"
            label="Phone number"
            inputType="text"
            placeholder="Phone number"
            value={phoneNumber.value}
            onChange={setPhoneNumber}
            error={phoneNumber.error}
          />
          <Checkbox
            name="isDriver"
            label="Do you drive?"
            checked={isDriver.value}
            onChange={setIsDriver}
            error={isDriver.error}
          />
          <Checkbox
            name="isOwner"
            label="Do you own a parking space?"
            checked={isOwner.value}
            onChange={setIsOwner}
            error={isOwner.error}
          />
          {isDriver.value && (
            <>
              <InputField
                label="Your vehicle's license plate"
                name="licensePlate"
                inputType="text"
                placeholder="License plate"
                value={licensePlate.value}
                onChange={setLicensePlate}
                error={licensePlate.error}
              />
              <InputField
                label="Your vehicle model"
                name="vehicleModel"
                inputType="text"
                placeholder="Vehicle model"
                value={vehicleModel.value}
                onChange={setVehicleModel}
                error={vehicleModel.error}
              />
              <SelectField<Sizes | string>
                placeholder="Select size of your car"
                onChange={setVehicleSize}
                label="What is the size of your car?"
                value={vehicleSize.value}
                error={vehicleSize.error}
                options={[
                  { label: "x-Small", value: "XSMALL" },
                  { label: "Small", value: "SMALL" },
                  { label: "Medium", value: "MEDIUM" },
                  { label: "Large", value: "LARGE" },
                  { label: "x-Large", value: "XLARGE" },
                ]}
                name="vehicleSize"
              />
            </>
          )}
          <button onClick={submitForm} disabled={isPosting}>
            Create your profile
          </button>
        </div>
      </div>
    </>
  )
}
export default CreateProfile
