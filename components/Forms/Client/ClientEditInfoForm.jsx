import { updateAccount } from "@api/client";
import { Email, Input } from "@components/Fields";
import { Field, Fieldset, Form, HookForm, Submit } from "@components/HookForm";
import { useMutation } from "@hooks";
import { initialValues, validationSchema } from "@models/edit-profile-info";
import { pick } from "lodash";

const ClientEditInfoForm = ({ client, hide, accType }) => {
  const mutation = useMutation(updateAccount, {
    invalidateQueries: "/client/account",
  });

  const handleSubmit = async (values) => {
    await mutation.mutateAsync(values);
    hide();
  };

  return (
    <HookForm
      initialValues={{ ...initialValues, ...pick(client, ["email", "name"]) }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <Form className="space-y-4">
        <Fieldset label="Name" name="name">
          <Field as={Input} id="name" name="name" placeholder="John Doe" />
        </Fieldset>

        <Fieldset label="Email" name="email">
          <Field
            as={Email}
            id="email"
            name="email"
            placeholder="example@email.com"
            disabled={accType === "google"}
          />
        </Fieldset>

        <Submit className="button full primary mt-4 font-semibold text-base">Submit</Submit>
      </Form>
    </HookForm>
  );
};

export default ClientEditInfoForm;
