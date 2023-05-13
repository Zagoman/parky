import { useState } from "react"
import styles from "./CreateProfile.module.scss"
import { InputField } from "../FormElements/InputField/InputField"
import { Checkbox } from "../FormElements/CheckBox/Checkbox"
import { api } from "~/utils/api"
import { toast } from "react-hot-toast"
const CreateProfile: React.FC = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isDriver, setIsDriver] = useState<boolean>(false)
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const { mutate, isLoading: isPosting } = api.profile.create.useMutation({
    onSuccess: () => {
      setFirstName("")
      setLastName("")
      setIsOwner(false)
      setIsDriver(false)
      setPhoneNumber("")
      setUsername("")
    },
    onError: (e) => {
      const errorMessages = e.data?.zodError?.fieldErrors
      if (errorMessages) {
        for (const key in errorMessages) {
          if (errorMessages[key] !== undefined) {
            toast.error(errorMessages[key]?.at(0) as string)
          }
        }
        return
      }
      toast.error("Invalid submission, please try again")
    },
  })

  const submitForm = () => {
    const profile = mutate({
      firstName,
      lastName,
      isOwner,
      isDriver,
      phoneNumber,
      username,
    })
    console.log(profile)
  }

  return (
    <>
      <div className={styles.form}>
        <InputField
          name="firstname"
          label="First name"
          inputType="text"
          value={firstName}
          onChange={setFirstName}
          placeholder="First Name"
        />
        <InputField
          name="lastName"
          label="Last name"
          inputType="text"
          value={lastName}
          onChange={setLastName}
          placeholder="Last Name"
        />
        <InputField
          name="username"
          label="Username"
          inputType="text"
          value={username}
          onChange={setUsername}
          placeholder="Username"
        />
        <InputField
          name="phoneNumber"
          label="Phone number"
          inputType="text"
          placeholder="Phone number"
          value={phoneNumber}
          onChange={setPhoneNumber}
        />
        <Checkbox
          name="isDriver"
          label="Do you drive?"
          checked={isDriver}
          onChange={setIsDriver}
        />
        <Checkbox
          name="isOwner"
          label="Do you own a parking space?"
          checked={isOwner}
          onChange={setIsOwner}
        />
        <button onClick={submitForm} disabled={isPosting}>
          {" "}
          Create your profile{" "}
        </button>
      </div>
    </>
  )
}
export default CreateProfile
