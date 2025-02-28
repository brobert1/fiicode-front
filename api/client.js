import { axiosAuth } from "@lib";

export const setPreferences = (data) => {
  return axiosAuth.post("/client/add-preferences", data);
};
