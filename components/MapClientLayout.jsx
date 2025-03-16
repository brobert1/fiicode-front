import { FloatingMenu } from "@components";
import BaseClientLayout from "./BaseClientLayout";
import { useContext } from "react";
import { DirectionsContext } from "../contexts/DirectionsContext";

const MapClientLayout = ({ children, onGetDirections }) => {
  const { directions } = useContext(DirectionsContext) || { directions: null };

  return (
    <BaseClientLayout floatingMenu={!directions && <FloatingMenu onGetDirections={onGetDirections} />}>
      {children}
    </BaseClientLayout>
  );
};

export default MapClientLayout;
