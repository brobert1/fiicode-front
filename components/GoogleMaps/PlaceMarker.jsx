import React, { useState } from "react";
import { AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";

const PlaceMarker = ({ place, onClose }) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <AdvancedMarker position={place.location} onClick={() => setIsInfoOpen(true)}>
      <div className="relative">
        <div className="relative">
          <div className="w-10 h-10 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center transform -translate-y-1/2">
            <i className="fas fa-map-marker-alt text-white text-lg"></i>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4">
            <div className="w-0 h-0 border-l-5 border-r-5 border-t-8 border-transparent border-t-red-500"></div>
          </div>
        </div>
      </div>

      {isInfoOpen && (
        <InfoWindow position={place.location} onCloseClick={() => setIsInfoOpen(false)}>
          <div className="p-2 max-w-xs">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-800">{place.name}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(place.id);
                }}
                className="text-gray-500 hover:text-red-500"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">{place.address}</p>
            <div className="flex gap-2 mt-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${place.location.lat},${place.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-blue-500 text-white px-2 py-1 rounded flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <i className="fas fa-directions mr-1"></i> Directions
              </a>
            </div>
          </div>
        </InfoWindow>
      )}
    </AdvancedMarker>
  );
};

export default PlaceMarker;
