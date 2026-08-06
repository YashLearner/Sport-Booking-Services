import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        action: {
            type: String,
            required: true
        },

        resource: {
            type: String,
            required: true
        },

        resourceId: {
            type: mongoose.Schema.Types.ObjectId
        },

        description: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("AuditLog", auditLogSchema);