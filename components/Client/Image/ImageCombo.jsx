import { useState } from "react";
import Image from "./Image";
import ImageUpload from "./ImageUpload";
import ImageDelete from "./ImageDelete";

const ImageCombo = ({ uuid, src }) => {
  const [status, setStatus] = useState("idle");

  return (
    <div className="flex flex-col items-center gap-4">
      <Image src={src} status={status} />
      <div className="text-center">
        <p className="text-grey mb-2">Here you can upload your profile picture.</p>
        <p className="text-grey">
          The image should be at least 200x200px, JPG or PNG format and up to 5MB.
        </p>
        <div className="my-2 flex justify-center gap-2">
          <ImageUpload uuid={uuid} setStatus={setStatus} />
          {src && <ImageDelete setStatus={setStatus} />}
        </div>
      </div>
    </div>
  );
};

export default ImageCombo;
