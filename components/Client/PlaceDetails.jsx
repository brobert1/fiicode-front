import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@hooks";
import { addFavouritePlace, removeFavouritePlace } from "@api/client";
import PhotoCarousel from "./PhotoCarousel";
import OpeningHours from "./OpeningHours";
import Rating from "./Rating";
import { classnames } from "@lib";
import { Button } from "@components";

const PlaceDetails = ({ place, onClose, onGetDirections }) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    setIsAnimating(true);

    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [place?.id]);

  if (!place) return null;

  const { data: favouritePlacesData } = useQuery("/client/favourite-places");

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

  const isAddingFavorite = addMutation.status === "loading";
  const isRemovingFavorite = removeMutation.status === "loading";
  const isProcessingFavorite = isAddingFavorite || isRemovingFavorite;

  const handleFavouriteToggle = () => {
    if (isProcessingFavorite) return;

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

  const handleGetDirections = (e) => {
    e.preventDefault();
    if (onGetDirections) {
      onGetDirections({
        id: place.id,
        name: place.name,
        address: place.address,
        location: place.location,
      });

      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <div className={classnames(
      "p-4 transition-all duration-300 ease-in-out",
      isAnimating ? "animate-fadeIn" : ""
    )}>
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold text-gray-800">{place.name}</h2>
      </div>

      <div className="text-gray-600">
        <p>{place.address}</p>
      </div>

      {place.rating && (
        <Rating rating={place.rating} reviewCount={place.userRatingsTotal} size="sm" />
      )}

      {place.photos && place.photos.length > 0 && (
        <div className="mt-4">
          <PhotoCarousel photos={place.photos} altText={place.name} height={48} />
        </div>
      )}

      <OpeningHours openingHours={place.openingHours} />

      <div className="mt-4 space-y-2">
        {place.phone && (
          <a
            href={`tel:${place.phone}`}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <i className="fas fa-phone-alt mr-2"></i>
            {place.phone}
          </a>
        )}
        {place.website && (
          <a
            href={place.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <i className="fas fa-globe mr-2"></i>
            Visit website
          </a>
        )}
      </div>

      <div className="mt-6 flex space-x-2">
        <Button
          onClick={handleGetDirections}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
        >
          <i className="fas fa-directions mr-2"></i>
          Directions
        </Button>

        <Button
          onClick={handleFavouriteToggle}
          disabled={isProcessingFavorite}
          className={`flex-1 border py-2 px-4 rounded-lg flex items-center justify-center ${
            isProcessingFavorite
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : isFavorite
              ? "bg-pink-100 border-pink-300 text-pink-600 hover:bg-pink-200"
              : "bg-white border-gray-300 hover:bg-gray-100 text-gray-800"
          }`}
        >
          {isProcessingFavorite ? (
            <>
              <i className="fas fa-circle-notch fa-spin mr-2 text-gray-500"></i>
              {isFavorite ? "Removing..." : "Adding..."}
            </>
          ) : (
            <>
              <i
                className={`${isFavorite ? "fas" : "far"} fa-heart mr-2 ${
                  isFavorite ? "text-pink-600" : "text-pink-500"
                }`}
              ></i>
              {isFavorite ? "Remove" : "Add favourite"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PlaceDetails;
