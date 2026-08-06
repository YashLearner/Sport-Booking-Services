import AuditLog from "../models/AuditLog.js";

export const createAuditLog = async ({
    user,
    action,
    resource,
    resourceId,
    description,
    session
}) => {

    await AuditLog.create(
        [{
            user,
            action,
            resource,
            resourceId,
            description
        }],
        { session }
    );

};