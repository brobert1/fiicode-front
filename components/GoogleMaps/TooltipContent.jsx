import React from "react";

const TooltipContent = ({ placeInfo, loading, error, onClose, onGetDirections }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-2">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  if (!placeInfo) {
    return null;
  }

  return (
    <>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-800">{placeInfo.name}</h3>
      </div>

      {placeInfo.type && <div className="text-xs text-gray-500 -mt-1 mb-1">{placeInfo.type}</div>}

      <p className="text-sm text-gray-600 mb-2">{placeInfo.address}</p>

      <div className="flex gap-2 mt-2">
        <button
          onClick={onGetDirections}
          className="text-xs w-full justify-center bg-blue-500 text-white px-2 py-1 rounded flex items-center hover:bg-blue-600 transition-colors"
        >
          <i className="fas fa-directions mr-1"></i> Directions
        </button>
      </div>
    </>
  );
};

export default TooltipContent;
