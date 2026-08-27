import axiosInstance from "./axiosInstance";

export const joinWaitlistRequest = async (waitlistData) => {
  const response = await axiosInstance.post("/waitlist", waitlistData);
  return response.data;
};

export const getMyWaitlistRequest = async () => {
  const response = await axiosInstance.get("/waitlist/my");
  return response.data;
};
