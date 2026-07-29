import {
    createCourtService,
    getAllCourtsService,
    getCourtByIdService,
    updateCourtService,
    deleteCourtService,
} from "../services/courtService.js";

import asyncHandler from "../utils/asyncHandler.js";

export const createCourt = asyncHandler(async (req, res) => {

    const court = await createCourtService(req.body);

    res.status(201).json({
        success: true,
        message: "Court Created Successfully",
        data: court,
    });
});

export const getAllCourts = asyncHandler(async (req, res) => {

    const courts = await getAllCourtsService();

    res.status(200).json({
        success: true,
        count: courts.length,
        data: courts,
    })
});

export const getCourtById = asyncHandler(async (req, res) => {
    const court = await getCourtByIdService(req.params.id);

    if (!court) {
        return res.status(404).json({
            success: false,
            message: "Court not found",
        });
    }
    res.status(200).json({
        success: true,
        data: court,
    });
})

export const updateCourt = asyncHandler(async (req, res) => {
    const court = await updateCourtService(req.params.id, req.body);

    if (!court) {
        return res.status(404).json({
            success: false,
            message: "Court not found",
        });
    }

    res.status(200).json({
        success: true,
        message: "Court Updated Successfully",
        data: court,
    });
})

export const deleteCourt = asyncHandler( async(req , res ) =>{
    const court = await deleteCourtService(req.params.id);

     if (!court) {
      return res.status(404).json({
        success: false,
        message: "Court not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Court Deleted Successfully",
    });
})