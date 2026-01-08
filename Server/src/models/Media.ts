import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
    url: string;
    publicId: string;
    fileName: string;
    type: string; // 'image', 'document', etc.
    format: string; // 'jpg', 'png', 'pdf'
    size: number; // in bytes
    uploadedBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const MediaSchema: Schema = new Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    fileName: { type: String, required: true },
    type: { type: String, required: true, default: 'image' },
    format: { type: String },
    size: { type: Number },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true
});

// Indexes for faster searching/sorting
MediaSchema.index({ createdAt: -1 });
MediaSchema.index({ type: 1 });
MediaSchema.index({ uploadedBy: 1 });

/**
 * @swagger
 * components:
 *   schemas:
 *     Media:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the media
 *         url:
 *           type: string
 *           description: Public URL of the media
 *         publicId:
 *           type: string
 *           description: Cloudinary public ID
 *         fileName:
 *           type: string
 *           description: Original file name
 *         type:
 *           type: string
 *           description: Type of media (image, document)
 *         format:
 *           type: string
 *           description: File format/extension
 *         size:
 *           type: number
 *           description: File size in bytes
 *         uploadedBy:
 *           type: string
 *           description: ID of user who uploaded
 *         createdAt:
 *           type: string
 *           format: date-time
 */
export default mongoose.model<IMedia>('Media', MediaSchema);
