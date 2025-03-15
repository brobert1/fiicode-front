import { axiosAuth } from "@lib";

export const changePassword = (data) => {
  return axiosAuth.post("/admin/change-password", data);
};

export const createPartner = (data) => {
  return axiosAuth.post("/admin/partners", data);
};

export const setAlert = (data) => {
  return axiosAuth.post("/admin/set-alert", data);
};

export const deleteAlert = (id) => {
  return axiosAuth.delete(`/admin/alerts/${id}`);
};

export const addCustomRoute = (data) => {
  return axiosAuth.post("/admin/custom-routes", data);
};
