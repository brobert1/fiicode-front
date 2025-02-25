import { Field, Fieldset, Form, HookForm, Submit } from "@components/HookForm";
import { initialValues, validationSchema } from "@models/preferences-form";
import { Dropdown } from "@components/Fields";
import { useMutation, useProfile } from "@hooks";
import { setPreferences } from "@api/client";

const ClientPreferencesForm = () => {
  const { me } = useProfile();
  const mutation = useMutation(setPreferences, {
    redirectOnSuccess: "/client",
  });

  const handleSubmit = async (values) => {
    const updatedValues = { ...values, identity: me };
    await mutation.mutate(updatedValues);
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
              name="favourite_transportation"
            >
              <Field
                as={Dropdown}
                id="favourite_transportation"
                name="favourite_transportation"
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
              name="avoided_transportation"
            >
              <Field
                as={Dropdown}
                id="avoided_transportation"
                name="avoided_transportation"
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
              name="transportation_subscription"
            >
              <Field
                as={Dropdown}
                id="transportation_subscription"
                name="transportation_subscription"
                placeholder="Select one"
              >
                <option value="true">Yes, I buy one monthly</option>
                <option value="false">No, I buy a ticket when I need it</option>
              </Field>
            </Fieldset>
          </div>
          <div className="w-full sm:w-1/2">
            <Fieldset label="What's the best route for you?" name="prrefered_route">
              <Field
                as={Dropdown}
                id="prrefered_route"
                name="prrefered_route"
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
            <Fieldset label="You have a fixed route every day?" name="usual_route">
              <Field as={Dropdown} id="usual_route" name="usual_route" placeholder="Select one">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Field>
            </Fieldset>
          </div>
          <div className="w-full sm:w-1/2">
            <Fieldset label="During what time period do you travel?" name="route_hours">
              <Field as={Dropdown} id="route_hours" name="route_hours" placeholder="Select one">
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
          name="routes_alerts"
        >
          <Field as={Dropdown} id="routes_alerts" name="routes_alerts" placeholder="Select one">
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
