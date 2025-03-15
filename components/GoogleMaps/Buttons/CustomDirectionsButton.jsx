import React from "react";

// Custom DirectionsButton component
const CustomDirectionsButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md px-4 py-3 flex items-center justify-center text-secondary hover:text-blue-700 hover:bg-blue-50 transition-colors"
      title="Get Directions"
    >
      <i className="fas fa-plus text-lg"></i>
    </button>
  );
};

export default CustomDirectionsButton;
