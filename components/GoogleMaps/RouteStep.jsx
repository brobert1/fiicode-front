import React from "react";
import { getIconForStep, getTransitDetails } from "@functions/route-utils";
import TransitDetails from "./TransitDetails";

const RouteStep = ({ step }) => {
  const isTransit = step.travel_mode === "TRANSIT";
  const transitDetails = isTransit ? getTransitDetails(step) : null;

  return (
    <div className="py-2 border-b border-gray-100 last:border-0 ml-4">
      <div className="flex">
        <div className="mr-3 pt-1">
          <i className={`fas ${getIconForStep(step)} text-blue-500`}></i>
        </div>
        <div className="flex-1">
          <div
            className="text-sm text-gray-700"
            dangerouslySetInnerHTML={{ __html: step.instructions }}
          />
        </div>
      </div>

      {isTransit && transitDetails && <TransitDetails transitDetails={transitDetails} />}
    </div>
  );
};

export default RouteStep;
