import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { AutoSubmit } from ".";

const HookForm = ({ children, initialValues, validationSchema, onSubmit, autoSubmit }) => {
  // Create a new form context
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  });

  return (
    <FormProvider {...methods} onSubmit={(data) => onSubmit({ ...data }, methods)}>
      <form onSubmit={methods.handleSubmit((data) => onSubmit({ ...data }, methods))}>
        {children} {autoSubmit && <AutoSubmit onSubmit={onSubmit} />}
      </form>
    </FormProvider>
  );
};

export default HookForm;
