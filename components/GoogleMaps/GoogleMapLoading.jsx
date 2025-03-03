import React from "react";

const GoogleMapLoading = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
      <div className="flex items-center">
        <i className="fas fa-spinner fa-spin text-blue-500 mr-2"></i>
        <p>Fetching location...</p>
      </div>
    </div>
  );
};

export default GoogleMapLoading;
