import MapLayoutPages from "./MapLayoutPages";
import SlideUpMenu from "./SlideUpMenu";
import { useContext } from "react";
import { MapSearchContext } from "contexts/MapSearchContext";

const FloatingMenu = ({ onGetDirections }) => {
  const mapSearchContext = useContext(MapSearchContext);
  const isMapPage = !!mapSearchContext;

  return (
    <>
      {isMapPage && <SlideUpMenu onGetDirections={onGetDirections} />}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="flex h-20 items-center justify-around bg-white border-t shadow-md w-full">
          <MapLayoutPages />
        </div>
      </div>
    </>
  );
};

export default FloatingMenu;
