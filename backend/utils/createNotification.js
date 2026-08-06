import Notification from "../models/Notification.js";

export const createNotification = async ({
    user,
    title,
    message,
    type
}) => {

    return await Notification.create({

        user,

        title,

        message,

        type

    });

};