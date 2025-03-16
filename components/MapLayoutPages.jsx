import { Button, MenuItem } from "@components";
import { useContext, useRef } from "react";
import { MapSearchContext } from "contexts/MapSearchContext";
import { useDisclosure, useOnClickOutside } from "@hooks";
import { logout } from "@api/identity";

const MapLayoutPages = () => {
  const mapSearchContext = useContext(MapSearchContext);
  const { searchVisible, setSearchVisible } = mapSearchContext || {
    searchVisible: false,
    setSearchVisible: () => {},
  };

  const { isOpen, toggle, hide } = useDisclosure();
  const menuRef = useRef();
  useOnClickOutside(menuRef, hide);

  const isMapPage = !!mapSearchContext;

  const handleLogout = async () => {
    hide();
    await logout();
  };

  return (
    <>
      <MenuItem
        href="/client"
        className="flex items-center justify-center py-2"
      >
        <i className="fa fa-house text-xl"></i>
      </MenuItem>
      {isMapPage && (
        <Button
          className="flex items-center justify-center py-2"
          onClick={(e) => {
            e.preventDefault();
            setSearchVisible(!searchVisible);
          }}
        >
          <i className="fa fa-magnifying-glass text-xl"></i>
        </Button>
      )}
      <MenuItem
        href="/client/notifications"
        className="flex items-center justify-center py-2"
      >
        <i className="fa fa-bell text-xl"></i>
      </MenuItem>
      <div className="relative inline-block">
        <Button
          className="flex items-center justify-center py-2"
          onClick={toggle}
          ref={menuRef}
        >
          <i
            className={`fa fa-gear text-xl transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
          ></i>
        </Button>
        {isOpen && (
          <div className="absolute left-1/2 bottom-full mb-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 transform -translate-x-1/2 transition-opacity duration-200 ease-in-out opacity-100">
            <button
              className="flex w-full items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt w-6"></i>
              Logout
            </button>
          </div>
        )}
      </div>
      <MenuItem
        href="/client/account"
        className="flex items-center justify-center py-2"
      >
        <i className="fa fa-user text-xl"></i>
      </MenuItem>
    </>
  );
};

export default MapLayoutPages;
