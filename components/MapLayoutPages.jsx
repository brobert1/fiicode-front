import { MenuItem } from "@components";
import { useRef } from "react";
import { useDisclosure, useOnClickOutside } from "@hooks";
import { logout } from "@api/identity";

// Simple button component that doesn't use ref
const ActionButton = ({ children, onClick, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={className}
  >
    {children}
  </button>
);

const MapLayoutPages = () => {
  const { isOpen, toggle, hide } = useDisclosure();
  const menuRef = useRef();
  useOnClickOutside(menuRef, hide);

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
      <MenuItem
        href="/client/chats"
        className="flex items-center justify-center py-2"
      >
        <i className="fa fa-message text-xl"></i>
      </MenuItem>
      <MenuItem
        href="/client/notifications"
        className="flex items-center justify-center py-2"
      >
        <i className="fa fa-bell text-xl"></i>
      </MenuItem>
      <div className="relative inline-block" ref={menuRef}>
        <ActionButton
          className="menu-item cursor-pointer px-2 py-2 pl-6"
          onClick={toggle}
        >
          <i
            className={`fa fa-gear text-xl transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
          ></i>
        </ActionButton>
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
