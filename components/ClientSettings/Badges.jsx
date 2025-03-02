import React from "react";
import { useQuery } from "@hooks";
import BadgesSuccess from "./BadgesSuccess";
import BadgesSkeleton from "./BadgesSkeleton";

const Badges = ({ xp }) => {
  const { data, status } = useQuery("/badges");

  return (
    <>
      {status === "loading" && <BadgesSkeleton type="loading" />}
      {status === "error" && <BadgesSkeleton type="error" />}
      {status === "success" && <BadgesSuccess data={data} xp={xp} />}
    </>
  );
};

export default Badges;
