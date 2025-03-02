import React from "react";
import Bone from "../Bone";
import { classnames } from "@lib";

const BadgesSkeleton = ({ type }) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      <div className="flex justify-between items-center">
        <Bone type={type} extraClass="w-32 h-8" />
        <Bone type={type} extraClass="w-16 h-4" />
      </div>
      <div
        className={classnames(
          "h-2 w-full rounded-full",
          type === "loading" && "bg-gray-300 animate-pulse",
          type === "error" && "bg-red-300"
        )}
      ></div>
      <div className="flex justify-between text-xs text-gray-500 px-1">
        <Bone type={type} extraClass="w-24 h-3" />
        <Bone type={type} extraClass="w-20 h-3" />
      </div>
      <div className="relative">
        <div className="flex overflow-x-auto py-4 gap-4 hide-scrollbar">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-6 rounded-lg w-[180px] min-w-[180px] border border-dashed border-gray-300"
              >
                <div
                  className={classnames(
                    "w-16 h-16 flex items-center justify-center rounded-full mb-4",
                    type === "loading" && "bg-gray-300 animate-pulse",
                    type === "error" && "bg-red-300"
                  )}
                ></div>

                <Bone type={type} extraClass="w-24 h-6 mb-1" />
                <Bone type={type} extraClass="w-16 h-3" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BadgesSkeleton;
