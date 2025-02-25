import { signup } from "@api/identity";
import { Email, Input, Password, Recaptcha } from "@components/Fields";
import { Field, Fieldset, Form, HookForm, Submit } from "@components/HookForm";
import { initialValues, validationSchema } from "@models/signup";
import { useRef } from "react";

const SignupForm = () => {
  const ref = useRef(null);
  const handleSubmit = async (values) => {
    await signup(ref, values);
  };

  return (
    <HookForm
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <Form className="space-y-4">
        <Fieldset name="name" label="Name">
          <Field id="name" name="name" as={Input} autoFocus={true} />
        </Fieldset>

        <Fieldset name="email" label="Email">
          <Field id="email" name="email" as={Email} />
        </Fieldset>

        <Fieldset name="password" label="Password">
          <Field id="password" name="password" as={Password} />
        </Fieldset>

        <Submit className="button mt-4 full primary w-full rounded-lg text-base sm:text-sm font-medium p-2.5">
          Sign up
        </Submit>
        <Recaptcha ref={ref} />
      </Form>
    </HookForm>
  );
};

export default SignupForm;
