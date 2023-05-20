import type { inferRouterInputs } from "@trpc/server"
import { type SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { InputField } from "~/components/FormElements/InputField/InputField"
import type { AppRouter } from "~/server/api/root"
import { api } from "~/utils/api"

type RouterInput = inferRouterInputs<AppRouter>
type CreateParkingInput = RouterInput["parking"]["create"]
const CreateParking: React.FC = () => {
  const { mutate, error } = api.parking.create.useMutation({
    onSuccess: () => {
      toast.success("Parking slot created")
    },
  })
  const { register, handleSubmit } = useForm<CreateParkingInput>()
  const onSubmit: SubmitHandler<CreateParkingInput> = (data) => {
    console.log(data)
    mutate({
      ...data,
      price: data.price,
    })
  }

  return (
    <>
      {/*eslint-disable-next-line */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          name="address"
          register={register}
          label="Insert your address"
          inputType="text"
          placeholder="Address"
          error={error?.data?.zodError?.fieldErrors["address"]?.at(0)}
        />
        <InputField
          name="price"
          register={register}
          label="What is the desired price?"
          inputType="number"
          placeholder=""
          error={error?.data?.zodError?.fieldErrors["price"]?.at(0)}
        />
        <InputField
          name="availableStart"
          register={register}
          label="Available parking start"
          inputType="datetime-local"
          placeholder=""
          error={error?.data?.zodError?.fieldErrors["availableStart"]?.at(0)}
        />
        <InputField
          name="availableEnd"
          register={register}
          label="Available parking end"
          inputType="datetime-local"
          placeholder=""
          error={error?.data?.zodError?.fieldErrors["availableEnd"]?.at(0)}
        />
        <InputField
          name="latitude"
          register={register}
          label="Latitude"
          inputType="number"
          placeholder=""
          error={error?.data?.zodError?.fieldErrors["latitude"]?.at(0)}
          step={0.00001}
        />
        <InputField
          name="longitude"
          register={register}
          label="Longitude"
          inputType="number"
          placeholder=""
          error={error?.data?.zodError?.fieldErrors["longitude"]?.at(0)}
          step={0.00001}
        />
        <InputField
          name="description"
          register={register}
          label="Write description of parking spot"
          inputType="text"
          placeholder=""
          error={error?.data?.zodError?.fieldErrors["description"]?.at(0)}
          step={0.00001}
        />
        <select {...register("dimensions")}>
          <option value="XSMALL">X-Small</option>
          <option value="SMALL">Small</option>
          <option value="MEDIUM">Medium</option>
          <option value="LARGE">Large</option>
          <option value="XLARGE">X-Large</option>
        </select>
        <select multiple {...register("features")}>
          <option value="Camera">Camera</option>
          <option value="Charging">Charging</option>
        </select>
        <input type="submit" />
      </form>
    </>
  )
}
export default CreateParking
