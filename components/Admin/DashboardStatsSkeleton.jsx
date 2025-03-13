import { Bone } from "@components";
import React from "react";

const DashboardStatsSkeleton = ({ type = "loading" }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-white flex flex-col gap-2 rounded-lg shadow p-4">
          <Bone type={type} extraClass="w-40" />
          <Bone type={type} extraClass="w-12 h-6" />
          <Bone type={type} extraClass="w-40" />
        </div>
      ))}
    </div>
  );
};

export default DashboardStatsSkeleton;
