import React from "react";
import DashboardCard from "./DashboardCard";
import { useQuery } from "@hooks";
import DashboardStatsSkeleton from "./DashboardStatsSkeleton";

const DashboardStats = () => {
  const { data, status } = useQuery("/admin/stats");

  return (
    <>
      {status === "loading" && <DashboardStatsSkeleton />}
      {status === "error" && <DashboardStatsSkeleton type="error" />}
      {status === "success" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.map((item, index) => (
            <DashboardCard
              key={index}
              title={item.title}
              value={item.value}
              description={item.description}
              />
            ))}
        </div>
      )}
    </>
  );
};

export default DashboardStats;
