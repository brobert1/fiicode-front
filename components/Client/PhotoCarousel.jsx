import { Button } from "@components";
import React, { useState } from "react";

const PhotoCarousel = ({ photos, altText }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!photos || photos.length === 0) return null;

  const nextPhoto = (e) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setCurrentPhotoIndex((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
  };

  const goToPhoto = (index, e) => {
    e.stopPropagation();
    setCurrentPhotoIndex(index);
  };

  return (
    <div className="relative w-full">
      <div className="w-full aspect-[16/9] overflow-hidden rounded-lg relative">
        <img
          src={photos[currentPhotoIndex].url}
          alt={altText || "Place photo"}
          className="w-full h-full object-cover object-center"
        />

        {photos.length > 1 && (
          <>
            <Button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 text-white"
            >
              <i className="fas fa-chevron-left"></i>
            </Button>
            <Button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 text-white"
            >
              <i className="fas fa-chevron-right"></i>
            </Button>

            <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
              {photos.map((_, index) => (
                <Button
                  key={index}
                  onClick={(e) => goToPhoto(index, e)}
                  className={`h-2 w-2 rounded-full ${
                    index === currentPhotoIndex ? "bg-white" : "bg-white bg-opacity-50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PhotoCarousel;
