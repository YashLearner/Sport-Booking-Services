import axiosInstance from "./axiosInstance";

export const getMyNotificationsRequest = async () => {
  const response = await axiosInstance.get("/notification");
  return response.data;
};

export const markNotificationReadRequest = async (id) => {
  const response = await axiosInstance.patch(`/notification/${id}/read`);
  return response.data;
};

export const markAllNotificationsReadRequest = async () => {
  const response = await axiosInstance.patch("/notification/read-all");
  return response.data;
};

export const deleteNotificationRequest = async (id) => {
  const response = await axiosInstance.delete(`/notification/${id}`);
  return response.data;
};
