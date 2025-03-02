import { changePassword } from "@api/admin";
import { logout } from "@api/identity";
import { Password } from "@components/Fields";
import { Field, Fieldset, Form, HookForm, Submit } from "@components/HookForm";
import { useMutation } from "@hooks";
import { initialValues, validationSchema } from "@models/change-password";

const ClientChangePasswordForm = () => {
  const mutation = useMutation(changePassword, {
    successCallback: async () => {
      await logout();
    },
  });

  const handleSubmit = async (values) => {
    await mutation.mutate(values);
  };

  return (
    <HookForm
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <Form className="space-y-4">
        <Fieldset
          name="changePassword"
          label="New password"
        >
          <Field autoFocus id="changePassword" name="changePassword" as={Password} />
        </Fieldset>

        <Fieldset
          name="confirmPassword"
          label="Confirm password"
          help="Must match your new password"
        >
          <Field id="confirmPassword" name="confirmPassword" as={Password} />
        </Fieldset>

        <Submit className="button full primary font-semibold text-base">Submit</Submit>
      </Form>
    </HookForm>
  );
};

export default ClientChangePasswordForm;
