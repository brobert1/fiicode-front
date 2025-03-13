import React from "react";

const DashboardCard = ({ title, value, description }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
};

export default DashboardCard;
