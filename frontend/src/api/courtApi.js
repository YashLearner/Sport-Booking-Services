import axiosInstance from "./axiosInstance";

export const getAllCourtsRequest = async () => {
  const response = await axiosInstance.get("/courts");
  return response.data;
};

export const getCourtByIdRequest = async (id) => {
  const response = await axiosInstance.get(`/courts/${id}`);
  return response.data;
};
