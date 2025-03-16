import { removeImage } from "@api/client";
import { Button } from "@components";
import { useMutation } from "@hooks";
import { useEffect } from "react";

const ImageDelete = ({ setStatus }) => {
  const mutation = useMutation(removeImage, {
    invalidateQueries: "/client/account",
  });

  useEffect(() => {
    setStatus(mutation.status);
  }, [mutation.status, setStatus]);

  return (
    <Button
      className="button mini accent"
      disabled={mutation.isLoading}
      onClick={mutation.mutateAsync}
    >
      Delete
    </Button>
  );
};

export default ImageDelete;
