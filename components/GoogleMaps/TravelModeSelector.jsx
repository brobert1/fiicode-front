import React from "react";

const TravelModeSelector = ({
  selectedMode,
  onChange,
  isLoading = false,
  loadingMode = null,
  className = ""
}) => {
  const travelModes = [
    { id: "DRIVING", icon: "fa-car", label: "Drive" },
    { id: "WALKING", icon: "fa-walking", label: "Walk" },
    { id: "TRANSIT", icon: "fa-bus", label: "Transit" }
  ];

  return (
    <div className={`flex justify-between bg-gray-50 p-2 rounded-lg ${className}`}>
      {travelModes.map(mode => (
        <button
          key={mode.id}
          onClick={() => onChange(mode.id)}
          className={`flex flex-col items-center justify-center px-3 py-2 rounded-md transition-all ${
            selectedMode === mode.id
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-gray-200"
          }`}
          disabled={isLoading}
        >
          {isLoading && loadingMode === mode.id ? (
            <i className="fas fa-circle-notch fa-spin text-lg"></i>
          ) : (
            <i className={`fas ${mode.icon} text-lg`}></i>
          )}
          <span className="text-xs mt-1">{mode.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TravelModeSelector;
