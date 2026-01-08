import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
    user: mongoose.Types.ObjectId;
    action: string;
    resource: string;
    resourceId?: string; // ID of the affected resource (if any)
    details?: Record<string, any>; // JSON object with changes or specific details
    ip: string;
    userAgent: string;
    createdAt: Date;
}

const AuditLogSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // e.g., 'CREATE', 'UPDATE', 'DELETE', 'LOGIN'
    resource: { type: String, required: true }, // e.g., 'Service', 'User', 'Review'
    resourceId: { type: String },
    details: { type: Schema.Types.Mixed },
    ip: { type: String },
    userAgent: { type: String }
}, {
    timestamps: { createdAt: true, updatedAt: false } // Logs are immutable, only createdAt
});

// Indexes for analytics and filtering
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ user: 1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ resource: 1 });

/**
 * @swagger
 * components:
 *   schemas:
 *     AuditLog:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         user:
 *           type: string
 *           description: User ID who performed the action
 *         action:
 *           type: string
 *           description: Type of action (CREATE, UPDATE, DELETE, LOGIN)
 *         resource:
 *           type: string
 *           description: Resource affected (Service, User, etc.)
 *         resourceId:
 *           type: string
 *           description: ID of the resource
 *         details:
 *           type: object
 *           description: Additional details or changed fields
 *         ip:
 *           type: string
 *         userAgent:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */
export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
