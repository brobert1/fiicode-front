import React from "react";
import PredictionList from "./PredictionList";

const LocationInput = ({
  value,
  onChange,
  placeholder,
  icon,
  iconColor,
  predictions,
  highlightedIndex,
  onSelect,
  inputRef,
}) => {
  return (
    <div className="relative mb-4">
      <div className={`absolute left-3 top-2 ${iconColor}`}>
        <i className={`fas ${icon}`}></i>
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />

      <PredictionList
        predictions={predictions}
        highlightedIndex={highlightedIndex}
        onSelect={onSelect}
      />
    </div>
  );
};

export default LocationInput;
