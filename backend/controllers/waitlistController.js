import asyncHandler from "express-async-handler";

import { joinWaitlistService } from "../services/waitlistServices.js";

export const joinWaitlist = asyncHandler(async (req, res) => {

    const waitlist = await joinWaitlistService({
        userId: req.user.id,
        ...req.body
    });

    res.status(201).json({
        success: true,
        data: waitlist
    });

});