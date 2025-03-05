import { useEffect, useMemo, useCallback } from "react";
import { useDropdown } from "@hooks";
import { classnames } from "@lib";
import OptionList from "./OptionList";
import Option from "./Option";
import partners from "../../data/partners-data";

const PartnerDropdown = ({
  value,
  onChange,
  onPartnerSelect,
  placeholder = "Select a partner",
  disabled,
  icon,
}) => {
  // Helper function to get partner data by value.
  const getPartnerData = useCallback(
    (selectedValue) => partners.find((partner) => partner.value === selectedValue)?.data,
    []
  );

  // Handler for selection change.
  const handleSelect = useCallback(
    (selectedValue) => {
      onChange?.(selectedValue);
      const partnerData = getPartnerData(selectedValue);
      if (partnerData) {
        onPartnerSelect?.(partnerData);
      }
    },
    [onChange, onPartnerSelect, getPartnerData]
  );

  // Memoize options to avoid recalculating on every render.
  const options = useMemo(
    () =>
      partners.map((partner) => (
        <Option key={partner.value} value={partner.value} label={partner.label}>
          <div className="flex items-center">
            {partner.data.logo_url && (
              <img
                src={partner.data.logo_url}
                alt={`${partner.label} logo`}
                className="w-6 h-6 mr-2 object-contain"
              />
            )}
            {partner.label}
          </div>
        </Option>
      )),
    []
  );

  const { inputItems, ...downshift } = useDropdown({
    children: options,
    value,
    onChange: handleSelect,
  });

  // Update partner details when initial value changes.
  useEffect(() => {
    if (value) {
      const partnerData = getPartnerData(value);
      if (partnerData) {
        onPartnerSelect?.(partnerData);
      }
    }
  }, [value, onPartnerSelect, getPartnerData]);

  return (
    <div className="relative">
      <div
        className={classnames(
          "dropdown",
          downshift.isOpen && "rounded-b-none",
          disabled && "pointer-events-none bg-gray-200"
        )}
        {...downshift.getToggleButtonProps()}
      >
        <input
          value={downshift.selectedItem?.label || ""}
          className="-my-2 w-full bg-transparent outline-none"
          readOnly
          placeholder={placeholder}
          disabled={disabled}
        />
        <span role="button" className={classnames(disabled && "pointer-events-none")}>
          {icon || <i className="fas fa-chevron-down" />}
        </span>
      </div>
      <OptionList {...downshift}>{inputItems}</OptionList>
    </div>
  );
};

export default PartnerDropdown;
