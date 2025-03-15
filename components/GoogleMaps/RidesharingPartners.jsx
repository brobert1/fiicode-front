import React, { useEffect, useState } from "react";
import { useQuery, useRidesharingDeepLinks } from "@hooks";

const RidesharingPartners = ({ origin, destination }) => {
  const { data, status } = useQuery("/client/partners");
  const [partners, setPartners] = useState([]);
  const { openPartnerDeepLink } = useRidesharingDeepLinks(origin, destination);

  useEffect(() => {
    if (status === "success" && data) {
      // Format the data depending on the API response structure
      const formattedPartners = Array.isArray(data) ? data : data.data || [];
      setPartners(formattedPartners);
    }
  }, [data, status]);

  const handleOpenPartnerApp = (partner) => {
    const success = openPartnerDeepLink(partner);

    if (!success) {
      alert("Cannot open ridesharing app. Please try again.");
    }
  };

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
    <>
      {status === "error" && (
        <div className="p-4 bg-white rounded-lg shadow-md">
          <div className="flex justify-center">
            <i className="fas fa-exclamation-circle text-red-500 text-2xl"></i>
          </div>
          <p className="text-center mt-2 text-gray-600">
            Could not load ridesharing options. Please try again.
          </p>
        </div>
      )}
      {status === "loading" && (
        <div className="p-4 bg-white rounded-lg shadow-md">
          <div className="flex justify-center">
            <i className="fas fa-circle-notch fa-spin text-blue-500 text-2xl"></i>
          </div>
          <p className="text-center mt-2 text-gray-600">Loading ridesharing options...</p>
        </div>
      )}
      {status === "success" && (
        <div className="overflow-y-auto overscroll-contain max-h-[40vh] md:max-h-[40vh] p-4 pb-0 touch-pan-y">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            Available Ridesharing Options
          </h3>
          <div className="overflow-y-auto flex-grow pr-1 -mr-1 pb-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {partners.map((partner) => (
                <div
                  key={partner._id}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleOpenPartnerApp(partner)}
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
          </div>

          {/* Footer info */}
          <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
            <i className="fas fa-info-circle mr-1"></i>
            Click on a partner to open their app with your route
          </p>
        </div>
      )}
    </>
  );
};

export default RidesharingPartners;
