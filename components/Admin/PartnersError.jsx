import React from "react";

const PartnersError = () => {
  return (
    <div className="text-center py-8">
      <i className="fas fa-exclamation-circle text-red-500 text-4xl mb-4" />
      <p className="text-gray-600">Failed to load partners</p>
    </div>
  );
};

export default PartnersError;
