import React from "react";

const TransitDetails = ({ transitDetails }) => {
  if (!transitDetails) return null;

  return (
    <div className="ml-8 mt-2 mb-1">
      <div
        className="flex items-center px-2 py-1 rounded"
        style={{
          backgroundColor: transitDetails.color,
          color: transitDetails.textColor,
        }}
      >
        <span className="font-medium mr-1">{transitDetails.shortName || transitDetails.name}</span>
        <span className="text-xs">{transitDetails.vehicleName}</span>
      </div>

      <div className="text-xs mt-1 text-gray-600">
        <div>
          <span className="font-medium">From:</span> {transitDetails.departureStop}{" "}
          {transitDetails.departure && `(${transitDetails.departure})`}
        </div>
        <div>
          <span className="font-medium">To:</span> {transitDetails.arrivalStop}{" "}
          {transitDetails.arrival && `(${transitDetails.arrival})`}
        </div>
        <div>
          <span className="font-medium">Stops:</span> {transitDetails.numStops}
        </div>
      </div>
    </div>
  );
};

export default TransitDetails;
