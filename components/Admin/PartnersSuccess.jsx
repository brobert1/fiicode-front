import React from "react";
import PartnerCard from "./PartnerCard";

const PartnersSuccess = ({ data }) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.pages.flat().map((partner, i) => {
          return <PartnerCard key={`partner-${i}`} partner={partner} />;
        })}
      </div>
    </>
  );
};

export default PartnersSuccess;
