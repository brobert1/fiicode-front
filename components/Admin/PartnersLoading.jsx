import React from "react";

const PartnersLoading = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-gray-100 rounded-lg h-64 flex flex-col items-center justify-center p-6"
        >
          <div className="w-32 h-32 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-6 bg-gray-200 w-1/2 mb-2 rounded"></div>
          <div className="h-4 bg-gray-200 w-3/4 mb-6 rounded"></div>
          <div className="h-10 bg-gray-200 w-full rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default PartnersLoading;
