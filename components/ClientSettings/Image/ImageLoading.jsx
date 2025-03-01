import React from "react";

const ImageLoading = () => {
  return (
    <div className="absolute top-0 grid h-full w-full place-items-center">
      <div className="cssload-loader">
        <div className="cssload-inner cssload-one" />
        <div className="cssload-inner cssload-two" />
        <div className="cssload-inner cssload-three" />
      </div>
    </div>
  );
};

export default ImageLoading;
