import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

const AutoSubmit = ({ onSubmit }) => {
  const methods = useFormContext();

  // Watch all form values
  const values = useWatch();

  // Submit the form whenever values change
  useEffect(() => {
    methods.handleSubmit((data) => onSubmit({ ...data }, methods))();
  }, [values]);

  return null;
};

export default AutoSubmit;
