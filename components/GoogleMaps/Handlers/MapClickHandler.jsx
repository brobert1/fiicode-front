import { useMapClickHandler } from "@hooks";

const MapClickHandler = ({ onMapClick }) => {
  useMapClickHandler(onMapClick);
  return null;
};

export default MapClickHandler;
