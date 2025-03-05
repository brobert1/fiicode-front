import React, { useEffect, useState } from "react";
import { useQuery } from "@hooks";

const RidesharingPartners = ({ origin, destination }) => {
  const { data, status } = useQuery("/client/partners");
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    if (status === "success" && data) {
      // Format the data depending on the API response structure
      const formattedPartners = Array.isArray(data) ? data : data.data || [];
      setPartners(formattedPartners);
    }
  }, [data, status]);

  const handleOpenPartnerApp = (deepLink) => {
    if (!deepLink || !origin || !destination) return;

    // Replace the placeholders with actual coordinates
    const formattedLink = deepLink
      .replace("START_LAT", origin.lat)
      .replace("START_LON", origin.lng)
      .replace("END_LAT", destination.lat)
      .replace("END_LON", destination.lng);

    // Open the deep link
    window.open(formattedLink, "_blank");
  };

  if (status === "loading") {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-center">
          <i className="fas fa-circle-notch fa-spin text-blue-500 text-2xl"></i>
        </div>
        <p className="text-center mt-2 text-gray-600">Loading ridesharing options...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-center">
          <i className="fas fa-exclamation-circle text-red-500 text-2xl"></i>
        </div>
        <p className="text-center mt-2 text-gray-600">
          Could not load ridesharing options. Please try again.
        </p>
      </div>
    );
  }

  if (partners.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-center">
          <i className="fas fa-info-circle text-blue-500 text-2xl"></i>
        </div>
        <p className="text-center mt-2 text-gray-600">No ridesharing partners available.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Available Ridesharing Options</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {partners.map((partner) => (
          <div
            key={partner._id}
            className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => handleOpenPartnerApp(partner.deep_link)}
          >
            <div className="w-12 h-12 flex-shrink-0 mr-3">
              <img
                src={partner.image}
                alt={`${partner.name} logo`}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <h4 className="font-medium text-gray-800 truncate">{partner.name}</h4>
              <p className="text-xs text-gray-500 line-clamp-2 overflow-ellipsis">
                {partner.description}
              </p>
            </div>
            <div className="ml-2 flex-shrink-0">
              <i className="fas fa-external-link-alt text-blue-500"></i>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-4">
        <i className="fas fa-info-circle mr-1"></i>
        Click on a partner to open their app with your route
      </p>
    </div>
  );
};

export default RidesharingPartners;
