import { Search } from "@components/Fields";
import { Field, Fieldset, Form, HookForm } from "@components/HookForm";
import { initialValues, validationSchema } from "@models/search-friends";

const SearchFriends = ({ setOptions }) => {
  return (
    <HookForm
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={setOptions}
      autoSubmit={true}
    >
      <Form className="w-full">
        <Fieldset name="name">
          <Field id="name" name="name" as={Search} placeholder="Enter name" />
        </Fieldset>
      </Form>
    </HookForm>
  );
};

export default SearchFriends;
