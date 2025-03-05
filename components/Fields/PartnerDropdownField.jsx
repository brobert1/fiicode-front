import { Field, Fieldset } from "@components/HookForm";
import { PartnerDropdown } from ".";
import { useFormContext } from "react-hook-form";

const PartnerDropdownField = () => {
  const { setValue } = useFormContext();

  const handlePartnerSelect = (partnerData) => {
    if (partnerData) {
      setValue("name", partnerData.name);
      setValue("description", partnerData.description);
      setValue("website", partnerData.website);
      setValue("image", partnerData.logo_url);
      setValue("deep_link", partnerData.deep_link);
    }
  };

  return (
    <Fieldset name="name" label="Select Partner">
      <Field
        id="name"
        name="name"
        as={PartnerDropdown}
        placeholder="Select a partner or enter custom details"
        onPartnerSelect={handlePartnerSelect}
      />
    </Fieldset>
  );
};

export default PartnerDropdownField;
