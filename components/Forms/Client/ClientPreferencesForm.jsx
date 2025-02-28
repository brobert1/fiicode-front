import { Field, Fieldset, Form, HookForm, Submit } from "@components/HookForm";
import { initialValues, validationSchema } from "@models/preferences-form";
import { Dropdown } from "@components/Fields";
import { useMutation } from "@hooks";
import { setPreferences } from "@api/client";

const ClientPreferencesForm = () => {
  const mutation = useMutation(setPreferences, {
    redirectOnSuccess: "/client",
  });

  const handleSubmit = async (values) => {
    await mutation.mutate(values);
  };

  return (
    <HookForm
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className="flex flex-col gap-6 space-y-4 px-6 sm:px-12 md:px-20">
        <div className="w-full flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <Fieldset
              label="What's your favourite mean of transport?"
              name="favouriteTransportation"
            >
              <Field
                as={Dropdown}
                id="favouriteTransportation"
                name="favouriteTransportation"
                placeholder="Select one"
              >
                <option value="public_transport">Public Transport</option>
                <option value="ridesharing">Ridesharing</option>
                <option value="personal_car">Personal Car</option>
                <option value="bicycle">Bicycle</option>
                <option value="walk">Walk</option>
              </Field>
            </Fieldset>
          </div>
          <div className="w-full sm:w-1/2">
            <Fieldset
              label="What mean of transport you usually avoid?"
              name="avoidedTransportation"
            >
              <Field
                as={Dropdown}
                id="avoidedTransportation"
                name="avoidedTransportation"
                placeholder="Select one"
              >
                <option value="public_transport">Public Transport</option>
                <option value="ridesharing">Ridesharing</option>
                <option value="personal_car">Personal Car</option>
                <option value="bicycle">Bicycle</option>
                <option value="walk">Walk</option>
              </Field>
            </Fieldset>
          </div>
        </div>

        <div className="w-full flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <Fieldset
              label="Do you have a public transport subscription?"
              name="transportationSubscription"
            >
              <Field
                as={Dropdown}
                id="transportationSubscription"
                name="transportationSubscription"
                placeholder="Select one"
              >
                <option value="true">Yes, I buy one monthly</option>
                <option value="false">No, I buy a ticket when I need it</option>
              </Field>
            </Fieldset>
          </div>
          <div className="w-full sm:w-1/2">
            <Fieldset label="What's the best route for you?" name="prreferedRoute">
              <Field
                as={Dropdown}
                id="prreferedRoute"
                name="prreferedRoute"
                placeholder="Select one"
              >
                <option value="quickest">Quickest</option>
                <option value="cheapest">Cheapest</option>
                <option value="eco_friendly">Eco-Friendly</option>
                <option value="less_traffic">Less traffic</option>
                <option value="confortable">Most Comfortable</option>
              </Field>
            </Fieldset>
          </div>
        </div>

        <div className="w-full flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-1/2">
            <Fieldset label="You have a fixed route every day?" name="usualRoute">
              <Field as={Dropdown} id="usualRoute" name="usualRoute" placeholder="Select one">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Field>
            </Fieldset>
          </div>
          <div className="w-full sm:w-1/2">
            <Fieldset label="During what time period do you travel?" name="routeHours">
              <Field as={Dropdown} id="routeHours" name="routeHours" placeholder="Select one">
                <option value="morning">Morning (06:00 - 10:00)</option>
                <option value="lunch">Lunch (11:00 - 15:00)</option>
                <option value="afternoon">Afternoon (16:00 - 20:00)</option>
                <option value="night">Night (21:00 - 05:00)</option>
              </Field>
            </Fieldset>
          </div>
        </div>

        <div className="w-full border-t border-gray-300"></div>

        <Fieldset
          label="Do you want to receive traffic notifications & updates?"
          name="routesAlerts"
        >
          <Field as={Dropdown} id="routesAlerts" name="routesAlerts" placeholder="Select one">
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Field>
        </Fieldset>

        <Submit className="button full primary rounded-lg w-full font-semibold text-base">
          Save preferences
        </Submit>
      </Form>
    </HookForm>
  );
};

export default ClientPreferencesForm;
