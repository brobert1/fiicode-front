import { LatestAlertsFiltersForm } from "@components/Forms/Admin";
import { Form, HookForm } from "@components/HookForm";
import { initialValues, validationSchema } from "@models/latest-alerts-filter";

const AlertsFilter = ({ setOptions }) => {
  return (
    <HookForm
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={setOptions}
      autoSubmit={true}
    >
      <Form>
        <LatestAlertsFiltersForm />
      </Form>
    </HookForm>
  );
};

export default AlertsFilter;
