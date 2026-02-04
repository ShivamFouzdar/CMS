import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamMember extends Document {
    name: string;
    role: string;
    image: string;
    bio: string;
    social: {
        twitter?: string;
        linkedin?: string;
        email?: string;
    };
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const teamMemberSchema = new Schema<ITeamMember>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        role: {
            type: String,
            required: [true, 'Role is required'],
            trim: true
        },
        image: {
            type: String,
            required: [true, 'Image URL is required']
        },
        bio: {
            type: String,
            required: [true, 'Bio is required'],
            trim: true
        },
        social: {
            twitter: { type: String, trim: true },
            linkedin: { type: String, trim: true },
            email: { type: String, trim: true }
        },
        order: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Index for ordering
teamMemberSchema.index({ order: 1 });

export const TeamMember = mongoose.model<ITeamMember>('TeamMember', teamMemberSchema);
export default TeamMember;
