import { useState, useRef, useEffect, useContext } from "react";
import { DirectionsContext } from "../contexts/DirectionsContext";
import { MapSearchContext } from "../contexts/MapSearchContext";
import FavouritePlaces from "./Client/FavouritePlaces";
import { classnames } from "@lib";
import Friends from "./Client/Friends";
import SlideUpMenuContext from "../contexts/SlideUpMenuContext";
import PlaceDetails from "./Client/PlaceDetails";

const SlideUpMenu = ({ onGetDirections }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const menuRef = useRef(null);
  const contentRef = useRef(null);

  const { directions } = useContext(DirectionsContext) || {
    directions: null,
  };

  const { searchedPlaces } = useContext(MapSearchContext) || {
    searchedPlaces: [],
  };
  const currentPlace = searchedPlaces.length > 0 ? searchedPlaces[searchedPlaces.length - 1] : null;

  const shouldShowPlaceDetails = () => {
    if (!currentPlace) return false;

    return currentPlace.showInfoWindow === false;
  };

  const showPlaceDetails = shouldShowPlaceDetails();

  if (directions) return null;

  const toggleMenu = () => {
    setIsTransitioning(true);

    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }

    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const closeMenu = () => {
    setIsTransitioning(true);
    setIsOpen(false);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const handlePlaceClose = () => {
    closeMenu();
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

  useEffect(() => {
    if (showPlaceDetails) {
      setIsOpen(true);
    }
  }, [showPlaceDetails, currentPlace]);

  return (
    <SlideUpMenuContext.Provider value={{ isOpen, setIsOpen, closeMenu }}>
      <div
        className="fixed bottom-20 left-0 right-0 z-40"
        ref={menuRef}
        style={{
          pointerEvents: isOpen && !isTransitioning ? "auto" : "none",
        }}
      >
        <div
          className={classnames(
            "bg-white rounded-t-2xl shadow-lg transition-all duration-300 ease-in-out",
            isOpen ? "translate-y-0" : "translate-y-calc",
            isTransitioning ? "pointer-events-none" : ""
          )}
          style={{
            maxHeight: isOpen ? "50vh" : "100px",
            height: "auto",
            transform: isOpen ? "translateY(0)" : "translateY(calc(100% - 100px))",
            pointerEvents: "auto",
            display: "flex",
            flexDirection: "column",
            overflow: isOpen ? "hidden" : "visible",
          }}
        >
          <div
            className="flex justify-center cursor-pointer py-3 flex-shrink-0"
            onClick={toggleMenu}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          <div
            ref={contentRef}
            className={classnames(
              "flex-1 hide-scrollbar",
              "transition-opacity duration-300 ease-in-out",
              isOpen ? "opacity-100 overflow-y-auto" : "opacity-100 overflow-hidden"
            )}
          >
            {showPlaceDetails ? (
              <PlaceDetails
                place={currentPlace}
                onClose={handlePlaceClose}
                onGetDirections={onGetDirections}
              />
            ) : (
              <>
                <FavouritePlaces onGetDirections={onGetDirections} onMenuClose={closeMenu} />
                <Friends />
              </>
            )}
          </div>
        </div>
      </div>
    </SlideUpMenuContext.Provider>
  );
};

export default SlideUpMenu;
