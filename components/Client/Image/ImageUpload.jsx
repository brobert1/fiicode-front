import { uploadImage } from "@api/client";
import { Button } from "@components";
import { useMutation } from "@hooks";
import { useEffect, useRef } from "react";

const ImageUpload = ({ uuid, setStatus }) => {
  const fileInputRef = useRef(null);

  const mutation = useMutation(uploadImage, {
    invalidateQueries: "/client/account",
  });

  const handleFileChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    event.target.value = null;
    if (file) {
      mutation.mutateAsync({ file });
    }
  };

  const handleClick = (event) => {
    event.preventDefault();
    fileInputRef.current.click();
  };

  useEffect(() => {
    setStatus(mutation.status);
  }, [mutation.status, setStatus]);

  return (
    <>
      <Button
        className="button mini secondary"
        disabled={mutation.isLoading || !uuid}
        onClick={handleClick}
      >
        Upload
      </Button>
      <input
        accept=".jpg,.jpeg,.png"
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
        type="file"
      />
    </>
  );
};

export default ImageUpload;
