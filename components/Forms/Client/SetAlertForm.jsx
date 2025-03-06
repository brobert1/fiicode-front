import { Field, Fieldset, Form, HookForm, Submit } from "@components/HookForm";
import { Dropdown } from "@components/Fields";
import { useMutation } from "@hooks";
import { setAlert } from "@api/client";
import { initialValues, validationSchema } from "@models/alert-form";

const SetAlertForm = ({ location, onComplete }) => {
  const mutation = useMutation(setAlert, {
    invalidateQueries: "/client/alerts",
  });

  const formInitialValues = {
    ...initialValues,
    location: {
      latitude: location?.lat || location?.latitude || 0,
      longitude: location?.lng || location?.longitude || 0,
      address: location?.address || "",
    },
  };

  const handleSubmit = async (values) => {
    const formData = {
      ...values,
      location: {
        latitude: location?.lat || location?.latitude || values.location.latitude,
        longitude: location?.lng || location?.longitude || values.location.longitude,
        address: location?.address || values.location.address,
      },
    };

    await mutation.mutate(formData);

    if (onComplete) {
      onComplete();
    }
  };

  return (
    <HookForm
      initialValues={formInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className="flex flex-col space-y-4 px-6 sm:px-12 md:px-20">
        <Fieldset label="Alert Type" name="type">
          <Field as={Dropdown} id="type" name="type" placeholder="Select one">
            <option value="accident">Accident</option>
            <option value="construction">Construction</option>
            <option value="congestion">Congestion</option>
            <option value="other">Other</option>
          </Field>
        </Fieldset>

        <Submit className="button full primary rounded-lg w-full font-semibold text-base">
          Add Alert
        </Submit>
      </Form>
    </HookForm>
  );
};

export default SetAlertForm;
