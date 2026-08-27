import axiosInstance from "./axiosInstance.js";

// Maps 1:1 to the actual backend contract in routes/authRoutes.js —
// no endpoints invented. register/login are the only two that exist.
export const registerRequest = (payload) =>
  axiosInstance.post("/auth/register", payload).then((res) => res.data);

export const loginRequest = (payload) =>
  axiosInstance.post("/auth/login", payload).then((res) => res.data);

// GET /api/profile currently returns only the raw JWT payload
// ({id, role, iat, exp}) — not a full user document. Included here
// for completeness but not relied on for user display data yet;
// see the note in authSlice.js.
export const getProfileRequest = () =>
  axiosInstance.get("/profile").then((res) => res.data);
