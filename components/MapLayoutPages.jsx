import { Button, MenuItem } from "@components";
import { useContext } from "react";
import { MapSearchContext } from "contexts/MapSearchContext";

const MapLayoutPages = () => {
  const mapSearchContext = useContext(MapSearchContext);
  const { searchVisible, setSearchVisible } = mapSearchContext || {
    searchVisible: false,
    setSearchVisible: () => {},
  };

  const isMapPage = !!mapSearchContext;

  return (
    <>
      <MenuItem
        href="/client"
        className="group text-lg flex h-10 items-center justify-center rounded-full px-3 transition-colors md:px-4"
      >
        <i className="fa fa-house"></i>
      </MenuItem>
      {isMapPage && (
        <Button
          className="group text-lg flex h-10 items-center justify-center rounded-full px-3 transition-colors md:px-4"
          onClick={(e) => {
            e.preventDefault();
            setSearchVisible(!searchVisible);
          }}
        >
          <i className="fa fa-magnifying-glass"></i>
        </Button>
      )}
      <MenuItem
        href="#"
        className="group text-lg flex h-10 items-center justify-center rounded-full px-3 transition-colors md:px-4"
      >
        <i className="fa fa-bell"></i>
      </MenuItem>
      <MenuItem
        href="#"
        className="group text-lg flex h-10 items-center justify-center rounded-full px-3 transition-colors md:px-4"
      >
        <i className="fa fa-gear"></i>
      </MenuItem>
      <MenuItem
        href="/client/account"
        className="group text-lg flex h-10 items-center justify-center rounded-full px-3 transition-colors md:px-4"
      >
        <i className="fa fa-user"></i>
      </MenuItem>
    </>
  );
};

export default MapLayoutPages;
