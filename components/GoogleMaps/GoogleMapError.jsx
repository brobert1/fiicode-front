import React from "react";

const GoogleMapError = ({ error }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
      <div className="bg-red-50 text-red-700 p-4 rounded-md shadow-md flex items-center">
        <i className="fas fa-exclamation-circle mr-2"></i>
        <p>{error}</p>
      </div>
    </div>
  );
};

export default GoogleMapError;
