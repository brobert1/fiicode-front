import { useState, useRef, useEffect, useContext } from "react";
import { DirectionsContext } from "../contexts/DirectionsContext";
import FavouritePlaces from "./Client/FavouritePlaces";
import { classnames } from "@lib";

const SlideUpMenu = ({ onGetDirections }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const { directions } = useContext(DirectionsContext) || {
    directions: null,
  };

  if (directions) return null;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="fixed bottom-16 left-0 right-0 z-40"
      ref={menuRef}
      style={{
        pointerEvents: isOpen ? "auto" : "none",
      }}
    >
      <div
        className={classnames(
          "bg-white rounded-t-2xl shadow-lg transition-transform duration-300 ease-in-out",
          isOpen ? "translate-y-0" : "translate-y-calc"
        )}
        style={{
          maxHeight: "80vh",
          overflowY: "auto",
          transform: isOpen ? "translateY(0)" : "translateY(calc(100% - 60px))",
          pointerEvents: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Handle to pull up the menu */}
        <div className="flex justify-center cursor-pointer py-3" onClick={toggleMenu}>
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        <FavouritePlaces onGetDirections={onGetDirections} onMenuClose={() => setIsOpen(false)} />
      </div>
    </div>
  );
};

export default SlideUpMenu;
