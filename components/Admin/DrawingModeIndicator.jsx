import React from "react";

const DrawingModeIndicator = ({ onExit }) => {
  return (
    <div className="absolute top-4 left-4 z-10 bg-red-500 text-white rounded-lg shadow-md p-3 flex items-center">
      <div className="flex items-center">
        <i className="fas fa-pen-fancy text-xl mr-2"></i>
        <div>
          <p className="font-bold">Drawing Mode</p>
        </div>
      </div>
      <button
        onClick={onExit}
        className="ml-3 text-white hover:text-gray-200"
        title="Exit Drawing Mode"
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default DrawingModeIndicator;
