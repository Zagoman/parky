import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { InputField } from "~/components/FormElements/InputField/InputField";
import { type RouterInputs, api, type RouterOutputs } from "~/utils/api";

type CreateParkingInput = RouterInputs["parking"]["create"];
type CreateParkingProps = {
  update?: boolean;
  parking?: RouterOutputs["parking"]["getParkingById"];
  profile?: RouterOutputs["profile"]["getProfileByUsername"];
};

const CreateParking: React.FC<CreateParkingProps> = (props) => {
  const { update = false, parking } = props;
  const { mutate, error } = api.parking.create.useMutation({
    onSuccess: () => {
      toast.success("Parking slot created");
    },
  });
  const parkingUpdate = update
    ? api.parking.update.useMutation({
        onSuccess: () => {
          toast.success("Parking slot updated successfully");
        },
      })
    : null;

  const { register, handleSubmit } = useForm<CreateParkingInput>({
    defaultValues: {
      price: update && parking ? parking.price : undefined,
      address: update && parking ? parking.address : undefined,
      imageURL:
        update && parking && parking.imageURL ? parking.imageURL : undefined,
      latitude: update && parking ? parseFloat(parking.latitude) : undefined,
      longitude: update && parking ? parseFloat(parking.longitude) : undefined,
      dimensions: update && parking ? parking.dimensions : undefined,
      description: update && parking ? parking.description : undefined,
      availableEnd: update && parking ? parking.availableEnd : undefined,
      availableStart: update && parking ? parking.availableStart : undefined,
    },
  });
  const onSubmit: SubmitHandler<CreateParkingInput> = (data) => {
    if (!parkingUpdate) {
      mutate({
        ...data,
        availableEnd: data.availableEnd + ":00Z",
        availableStart: data.availableStart + ":00Z",
      });
      return;
    }
    if (parking?.id) {
      parkingUpdate.mutate({
        ...data,
        availableEnd: data.availableEnd + ":00Z",
        availableStart: data.availableStart + ":00Z",
        id: parking.id,
      });
    }
  };

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
          error={
            error?.data?.zodError?.fieldErrors["address"]?.at(0) ||
            parkingUpdate?.error?.data?.zodError?.fieldErrors["address"]?.at(0)
          }
        />
        <InputField
          name="price"
          register={register}
          label="What is the desired price?"
          inputType="number"
          placeholder=""
          error={
            error?.data?.zodError?.fieldErrors["price"]?.at(0) ||
            parkingUpdate?.error?.data?.zodError?.fieldErrors["price"]?.at(0)
          }
        />
        <InputField
          name="availableStart"
          register={register}
          label="Parking availability start date"
          inputType="datetime-local"
          placeholder=""
          error={
            error?.data?.zodError?.fieldErrors["availableStart"]?.at(0) ||
            parkingUpdate?.error?.data?.zodError?.fieldErrors[
              "availableStart"
            ]?.at(0)
          }
        />
        <InputField
          name="availableEnd"
          register={register}
          label="Parking availability end date"
          inputType="datetime-local"
          placeholder=""
          error={
            error?.data?.zodError?.fieldErrors["availableEnd"]?.at(0) ||
            parkingUpdate?.error?.data?.zodError?.fieldErrors[
              "availableEnd"
            ]?.at(0)
          }
        />
        <InputField
          name="latitude"
          register={register}
          label="Latitude"
          inputType="number"
          placeholder=""
          error={
            error?.data?.zodError?.fieldErrors["latitude"]?.at(0) ||
            parkingUpdate?.error?.data?.zodError?.fieldErrors["latitude"]?.at(0)
          }
          step={0.00001}
        />
        <InputField
          name="longitude"
          register={register}
          label="Longitude"
          inputType="number"
          placeholder=""
          error={
            error?.data?.zodError?.fieldErrors["longitude"]?.at(0) ||
            parkingUpdate?.error?.data?.zodError?.fieldErrors["longitude"]?.at(
              0
            )
          }
          step={0.00001}
        />
        <InputField
          name="description"
          register={register}
          label="Write description of parking spot"
          inputType="text"
          placeholder=""
          error={
            error?.data?.zodError?.fieldErrors["description"]?.at(0) ||
            parkingUpdate?.error?.data?.zodError?.fieldErrors[
              "description"
            ]?.at(0)
          }
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
          <option value="camera">Camera</option>
          <option value="charging">Charging</option>
        </select>
        <input type="submit" />
      </form>
    </>
  );
};
export default CreateParking;
