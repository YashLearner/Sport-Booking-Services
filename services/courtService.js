import Court from "../models/Court.js";

export const createCourtService = async (data) => {
  return await Court.create(data);
};

export const getAllCourtsService = async () => {
  return await Court.find();
};

export const getCourtByIdService = async (id) => {
  return await Court.findById(id);
};

export const updateCourtService = async (id, data) => {
  return await Court.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteCourtService = async (id) => {
  return await Court.findByIdAndDelete(id);
};