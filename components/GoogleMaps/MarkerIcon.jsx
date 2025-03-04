import React from "react";

const MarkerIcon = () => {
  return (
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
  );
};

export default MarkerIcon;
