import React, { useState, useEffect } from "react";
import { AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { Button } from "@components";
import { useFavoriteDirections, useMutation } from "@hooks";
import { addFavouritePlace, removeFavouritePlace } from "@api/client";

const PlaceMarker = ({
  place,
  onGetDirections,
  favouritePlacesData,
  autoOpenInfoWindow = false,
}) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    if (autoOpenInfoWindow && place.showInfoWindow !== false) {
      setIsInfoOpen(true);
    }
  }, [autoOpenInfoWindow, place.showInfoWindow]);

  const handleMarkerClick = () => {
    if (place.showInfoWindow !== false) {
      setIsInfoOpen(true);
    }
  };

  const { handleFavoriteDirections } = useFavoriteDirections({
    onGetDirections,
    onMenuClose: () => setIsInfoOpen(false),
  });

  const matchingFavPlace = favouritePlacesData?.find(
    (favPlace) =>
      favPlace.latitude === place.location.lat && favPlace.longitude === place.location.lng
  );

  const isFavorite = !!matchingFavPlace;

  const addMutation = useMutation(addFavouritePlace, {
    invalidateQueries: "/client/favourite-places",
  });

  const removeMutation = useMutation(removeFavouritePlace, {
    invalidateQueries: "/client/favourite-places",
  });

  const handleGetDirections = (e) => {
    e.stopPropagation();
    handleFavoriteDirections(place);
  };

  const handleFavouritePlaceToggle = (e) => {
    e.stopPropagation();

    if (isFavorite && matchingFavPlace) {
      removeMutation.mutate({ _id: matchingFavPlace._id });
    } else {
      addMutation.mutate({
        latitude: place.location.lat,
        longitude: place.location.lng,
        address: place.address,
      });
    }
  };

  return (
    <AdvancedMarker position={place.location} onClick={handleMarkerClick}>
      <div className="relative">
        <div className="relative">
          <div className="w-10 h-10 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center transform -translate-y-1/2">
            <i className="fas fa-map-marker-alt text-white text-lg"></i>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4">
            <div className="w-0 h-0 border-l-5 border-r-5 border-t-8 border-transparent border-t-red-500"></div>
          </div>
        </div>
      </div>

      {isInfoOpen && place.showInfoWindow !== false && (
        <InfoWindow position={place.location} headerDisabled={true}>
          <div className="p-2 max-w-xs">
            <div className="mb-2">
              <h3 className="font-bold text-gray-800">{place.name}</h3>
            </div>

            <p className="text-sm text-gray-600 mb-2 truncate">{place.address}</p>

            <div className="flex gap-2 mt-3">
              <Button
                onClick={handleGetDirections}
                className="text-xs w-2/3 justify-center bg-blue-500 text-white px-2 py-1 rounded flex items-center hover:bg-blue-600 transition-colors"
              >
                <i className="fas fa-directions mr-1"></i> Directions
              </Button>
              <Button
                onClick={handleFavouritePlaceToggle}
                className={`text-xs w-1/3 justify-center ${
                  isFavorite
                    ? "bg-pink-100 border-pink-300 text-pink-600"
                    : "bg-white border border-gray-300 text-gray-700"
                } px-2 py-1 rounded flex items-center hover:bg-gray-50 transition-colors`}
              >
                <i className={`${isFavorite ? "fas" : "far"} fa-heart`}></i>
              </Button>
            </div>
          </div>
        </InfoWindow>
      )}
    </AdvancedMarker>
  );
};

export default PlaceMarker;
