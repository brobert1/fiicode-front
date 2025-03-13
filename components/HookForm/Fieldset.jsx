import { classnames } from "@lib";
import { useFormContext } from "react-hook-form";

const Fieldset = ({ label, help, name, children, inline = false }) => {
  const {
    formState: { errors, touchedFields, isSubmitted },
  } = useFormContext();

  const hasError = touchedFields[name] && errors[name] && isSubmitted;

  return (
    <fieldset className={classnames(hasError && "has-error")}>
      {label && inline ? (
        // When inline is true, split into two parts: one for the label text and one for the children.
        <div className="flex items-center justify-between">
          <div className="form-label font-semibold text-base">{label}</div>
          <div>{children}</div>
        </div>
      ) : (
        <>
          {label && (
            <label
              htmlFor={name}
              className="form-label mb-1 w-full cursor-pointer font-semibold text-base"
            >
              {label}
            </label>
          )}
          {children}
        </>
      )}
      <div className="form-help first-letter text-sm text-secondary">
        {hasError ? errors[name]?.message : help}
      </div>
    </fieldset>
  );
};

export default Fieldset;
