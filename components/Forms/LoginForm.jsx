import { login } from "@api/identity";
import { Link } from "@components";
import { Checkbox, Email, Password, Recaptcha } from "@components/Fields";
import { Field, Fieldset, HookForm, Submit } from "@components/HookForm";
import { initialValues, validationSchema } from "@models/login";
import { useRef } from "react";

const LoginForm = () => {
  const ref = useRef(null);
  const handleSubmit = async (values) => {
    await login(ref, values);
  };

  return (
    <HookForm
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <Fieldset name="email" label="Email">
          <Field id="email" name="email" as={Email} autoFocus={true} />
        </Fieldset>

        <Fieldset name="password" label="Password">
          <Field id="password" name="password" as={Password} />
        </Fieldset>
        <div className="flex justify-between items-center w-full">
          <Checkbox>Remember me</Checkbox>
          <Link href="/forgot" className="text-gray-600 hover:underline">
            Forgot password?
          </Link>
        </div>
        <Submit className="button full primary w-full rounded-lg text-base sm:text-sm font-medium p-2.5">
          Login
        </Submit>
        <Recaptcha ref={ref} />
      </div>
    </HookForm>
  );
};

export default LoginForm;
