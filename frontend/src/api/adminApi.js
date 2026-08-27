import axiosInstance from "./axiosInstance";

export const getAdminStatsRequest = async () => {
  const response = await axiosInstance.get("/admin/stats");
  return response.data;
};

export const getAllAdminBookingsRequest = async () => {
  const response = await axiosInstance.get("/admin/bookings");
  return response.data;
};

export const getAllUsersRequest = async () => {
  const response = await axiosInstance.get("/admin/users");
  return response.data;
};

export const deleteUserRequest = async (id) => {
  const response = await axiosInstance.delete(`/admin/users/${id}`);
  return response.data;
};

export const createCourtRequest = async (courtData) => {
  const response = await axiosInstance.post("/courts", courtData);
  return response.data;
};

export const updateCourtRequest = async (id, courtData) => {
  const response = await axiosInstance.put(`/courts/${id}`, courtData);
  return response.data;
};

export const deleteCourtRequest = async (id) => {
  const response = await axiosInstance.delete(`/courts/${id}`);
  return response.data;
};
