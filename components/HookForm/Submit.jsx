import { Button } from "@components";
import { classnames } from "@lib";
import { useFormContext } from "react-hook-form";

const Submit = ({ children, className, isLoading, ...props }) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  const disabled = isLoading || isSubmitting;
  // Override the disabled prop when passed
  props.disabled = disabled;

  return (
    <div className="flex items-center w-full">
      <Button
        type="submit"
        className={classnames("button primary", className && className)}
        disabled={disabled}
        {...props}
      >
        <div>{children}</div>
      </Button>
      {disabled && (
        <img src="/icons/loading.gif" alt="loading" className="absolute inset-0 m-auto w-6 h-6" />
      )}
    </div>
  );
};

export default Submit;
