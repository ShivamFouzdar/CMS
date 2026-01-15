import { Schema, model, Document } from 'mongoose';

export interface INotification extends Document {
    type: 'new-lead' | 'job-application' | 'review' | 'system-alert';
    title: string;
    message: string;
    read: boolean;
    data?: any; // Metadata like IDs for navigation
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
    {
        type: {
            type: String,
            required: true,
            enum: ['new-lead', 'job-application', 'review', 'system-alert']
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        read: {
            type: Boolean,
            default: false
        },
        data: {
            type: Schema.Types.Mixed,
            default: {}
        }
    },
    {
        timestamps: true,
        collection: 'notifications'
    }
);

// Index for efficient querying of unread notifications
notificationSchema.index({ read: 1, createdAt: -1 });

export const Notification = model<INotification>('Notification', notificationSchema);
export default Notification;
