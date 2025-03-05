import { Field, Fieldset, Form, HookForm, Submit } from "@components/HookForm";
import { Input, Textarea, PartnerDropdownField } from "@components/Fields";
import { initialValues, validationSchema } from "@models/partner";
import { useMutation } from "@hooks";
import { createPartner } from "@api/admin";

const AddPartnerForm = ({ hide }) => {
  const mutation = useMutation(createPartner, {
    invalidateQueries: "/admin/partners",
  });

  const handleSubmit = (values) => {
    mutation.mutateAsync(values);
    hide();
  };

  return (
    <HookForm
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <div className="space-y-4">
          <PartnerDropdownField />
          <Fieldset name="description" label="Description">
            <Field
              id="description"
              name="description"
              as={Textarea}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </Fieldset>
          <Fieldset name="website" label="Website">
            <Field
              id="website"
              name="website"
              as={Input}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </Fieldset>
          <Fieldset name="image" label="Logo URL">
            <Field
              id="image"
              name="image"
              as={Input}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </Fieldset>
          <Field
            id="deep_link"
            name="deep_link"
            as={Input}
            className="w-full hidden rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
          <div className="flex justify-end">
            <Submit className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Add Partner
            </Submit>
          </div>
        </div>
      </Form>
    </HookForm>
  );
};

export default AddPartnerForm;
