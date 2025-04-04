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

export const addFavouritePlace = async (data) => {
  return axiosAuth.post("/client/add-favourite-place", data);
};

export const removeFavouritePlace = async (data) => {
  return axiosAuth.delete(`/client/remove-favourite-place/${data._id}`);
};

export const sendFriendRequest = async (data) => {
  return axiosAuth.post("/client/send-friend-request", data);
};

export const approveFriendRequest = async (id) => {
  return axiosAuth.put(`/client/approve-friend-request/${id}`);
};

export const rejectFriendRequest = async (id) => {
  return axiosAuth.delete(`/client/reject-friend-request/${id}`);
};

export const cancelFriendRequest = async (id) => {
  return axiosAuth.delete(`/client/cancel-friend-request/${id}`);
};

export const createConversation = async (data) => {
  return axiosAuth.post("/client/conversations", data);
};

export const sendMessage = async (data) => {
  return axiosAuth.post("/client/messages", data);
};

export const markConversationAsRead = async (conversationId) => {
  return axiosAuth.put(`/client/conversations/${conversationId}/read`);
};

export const updateLocation = async (data) => {
  return axiosAuth.put("/client/update-location", data);
};
