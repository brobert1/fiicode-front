import { axiosAuth } from "@lib";

export const setPreferences = (data) => {
  return axiosAuth.post("/client/add-preferences", data);
};

export const uploadImage = ({ file }) => {
  const data = new FormData();
  data.append("image", file);

  return axiosAuth.put(`/client/account/image`, data);
};

export const removeImage = async () => {
  return axiosAuth.delete("/client/account/image");
};
