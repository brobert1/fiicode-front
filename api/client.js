import { store } from "@auth";
import { axiosAuth, toaster } from "@lib";
import { decode } from "jsonwebtoken";

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

export const updateAccount = async (data) => {
  const { token, message } = await axiosAuth.put("/client/account", data);

  const decoded = decode(token);
  if (!decoded) {
    throw new Error("Failed to decode token. Please try again.");
  }

  store.dispatch({ type: "SET", jwt: token });
  toaster.success(message);
};

export const clientRemoveAccount = async () => {
  return axiosAuth.delete("/client/remove");
};

export const changePassword = async (data) => {
  return axiosAuth.post("/client/change-password", data);
};

export const setAlert = async (data) => {
  return axiosAuth.post("/client/set-alert", data);
};

export const setFCMToken = async (data) => {
  return axiosAuth.put("/client/set-fcm-token", data);
};
