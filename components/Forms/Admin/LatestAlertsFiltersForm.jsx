import { Dropdown } from "@components/Fields";
import { Field, Fieldset } from "@components/HookForm";
import { useFormContext } from "react-hook-form";

const LatestAlertsFiltersForm = () => {
  const { watch } = useFormContext();

  // Watch all form values
  const values = watch();

  return (
    <div className="hidden lg:flex flex-col gap-8">
      <div className="flex flex-col gap-1.5">
        <Fieldset name="type">
          <Field id="type" name="type" as={Dropdown} value={values?.type}>
            <option value="all">All</option>
            <option value="congestion">Congestion</option>
            <option value="accident">Accident</option>
            <option value="construction">Construction</option>
            <option value="other">Other</option>
          </Field>
        </Fieldset>
      </div>
    </div>
  );
};

export default LatestAlertsFiltersForm;
