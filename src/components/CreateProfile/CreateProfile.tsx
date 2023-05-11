import { useState } from "react"
import styles from "./CreateProfile.module.scss";
import { InputField } from "../FormElements/InputField/InputField";
import { Checkbox } from "../FormElements/CheckBox/Checkbox";
const CreateProfile: React.FC = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isDriver, setIsDriver] = useState<boolean>(false);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    return <>
        <div className={styles.form}>
            <InputField
                name="firstname"
                label="First name"
                inputType="text"
                value={firstName}
                onChange={setFirstName}
                placeholder="First Name" />
            <InputField
                name="lastName"
                label="Last name"
                inputType="text"
                value={lastName}
                onChange={setLastName}
                placeholder="Last Name" />
            <InputField
                name="username"
                label="Username"
                inputType="text"
                value={username}
                onChange={setUsername}
                placeholder="Username" />
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
        </div>
    </>
}
export default CreateProfile
