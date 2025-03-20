import React, { useState, useEffect } from "react";
import { AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { Button } from "@components";
import { useMutation, useFavoriteDirections } from "@hooks";
import { addFavouritePlace, removeFavouritePlace } from "@api/client";

const PlaceMarker = ({
  place,
  onGetDirections,
  favouritePlacesData,
  autoOpenInfoWindow = false,
}) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Use effect to automatically open the info window when autoOpenInfoWindow is true
  useEffect(() => {
    if (autoOpenInfoWindow) {
      setIsInfoOpen(true);
    }
  }, [autoOpenInfoWindow]);

  // Use our custom hook for directions
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

    // Our hook now handles different place formats
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

  // Helper function to format place types for display
  const formatPlaceType = (type) => {
    return type
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Helper function to render price level
  const renderPriceLevel = (priceLevel) => {
    if (priceLevel === undefined || priceLevel === null) return null;

    const dollars = [];
    for (let i = 0; i < 4; i++) {
      dollars.push(
        <span key={i} className={i < priceLevel ? "text-green-600" : "text-gray-300"}>
          $
        </span>
      );
    }
    return <div className="flex">{dollars}</div>;
  };

  // Helper function to render star rating
  const renderRating = (rating) => {
    if (!rating) return null;

    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<i key={i} className="fas fa-star text-yellow-400"></i>);
      } else if (i === fullStars && halfStar) {
        stars.push(<i key={i} className="fas fa-star-half-alt text-yellow-400"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star text-yellow-400"></i>);
      }
    }

    return stars;
  };

  return (
    <AdvancedMarker position={place.location} onClick={() => setIsInfoOpen(true)}>
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

      {isInfoOpen && (
        <InfoWindow position={place.location} headerDisabled={true}>
          <div className="p-2 max-w-xs">
            <div className="mb-2">
              <h3 className="font-bold text-gray-800">{place.name}</h3>
            </div>

            {/* Photo carousel */}
            {place.photos && place.photos.length > 0 && (
              <div className="relative mb-3">
                <div className="w-full h-32 overflow-hidden rounded bg-gray-100">
                  <img
                    src={place.photos[activePhotoIndex].url}
                    alt={place.name}
                    className="w-full h-32 object-cover"
                    style={{ aspectRatio: "16/9" }}
                  />
                </div>
                {place.photos.length > 1 && (
                  <div className="absolute bottom-2 right-2 flex space-x-1">
                    {place.photos.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePhotoIndex(index);
                        }}
                        className={`w-2 h-2 rounded-full ${
                          index === activePhotoIndex ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Address */}
            <p className="text-sm text-gray-600 mb-2 truncate">{place.address}</p>

            {/* Place type */}
            {place.types && place.types.length > 0 && (
              <div className="mb-2">
                <span className="text-xs text-gray-500">{formatPlaceType(place.types[0])}</span>
                {place.priceLevel !== undefined && (
                  <span className="ml-2">{renderPriceLevel(place.priceLevel)}</span>
                )}
              </div>
            )}

            {/* Rating */}
            {place.rating && (
              <div className="flex items-center mb-2">
                <div className="flex mr-1">{renderRating(place.rating)}</div>
                <span className="text-xs text-gray-600">
                  {place.rating.toFixed(1)}
                  {place.userRatingsTotal && (
                    <span className="ml-1">({place.userRatingsTotal})</span>
                  )}
                </span>
              </div>
            )}

            {/* Opening hours */}
            {place.openingHours && (
              <div className="mb-2">
                <div className="flex items-center text-xs">
                  <i className="far fa-clock mr-1 text-gray-500"></i>
                  <span className={place.openingHours.isOpen ? "text-green-600" : "text-red-600"}>
                    {place.openingHours.isOpen ? "Open now" : "Closed now"}
                  </span>
                </div>
              </div>
            )}

            {/* Contact info */}
            {place.phone && (
              <div className="flex items-center mb-2 text-xs">
                <i className="fas fa-phone mr-1 text-gray-500"></i>
                <a
                  href={`tel:${place.phone}`}
                  className="text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {place.phone}
                </a>
              </div>
            )}

            {/* Website */}
            {place.website && (
              <div className="flex items-center mb-2 text-xs">
                <i className="fas fa-globe mr-1 text-gray-500"></i>
                <a
                  href={place.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  {new URL(place.website).hostname}
                </a>
              </div>
            )}

            {/* Action buttons */}
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
