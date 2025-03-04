import React from "react";
import RouteStep from "./RouteStep";

const RouteSteps = ({ legs }) => {
  if (!legs || legs.length === 0) return null;

  return (
    <div className="overflow-y-auto max-h-[40vh] p-4">
      {legs.map((leg, legIndex) => (
        <div key={legIndex} className="mb-4">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <i className="fas fa-circle text-blue-500 text-xs"></i>
            </div>
            <div className="text-sm font-medium">{leg.start_address}</div>
          </div>

          {leg.steps.map((step, stepIndex) => (
            <RouteStep key={stepIndex} step={step} />
          ))}

          <div className="flex items-center mt-2">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
              <i className="fas fa-map-marker-alt text-red-500"></i>
            </div>
            <div className="text-sm font-medium">{leg.end_address}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RouteSteps;
