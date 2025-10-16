// lib/models/Gallery.ts
import mongoose, { type Document, Schema } from "mongoose"

export interface IGallery extends Document {
    title: string
    image: string
    category: string
    isActive: boolean
    order: number // Add order field
    createdAt: Date
    updatedAt: Date
}

// Gallery categories
export const GALLERY_CATEGORIES = [
    { value: 'sports', label: 'Sports' },
    { value: 'events', label: 'Events' },
    { value: 'facilities', label: 'Facilities' },
    { value: 'achievements', label: 'Achievements' },
    { value: 'training', label: 'Training' },
    { value: 'other', label: 'Other' },
] as const

const gallerySchema = new Schema<IGallery>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },
        image: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: ['sports', 'events', 'facilities', 'achievements', 'training', 'other'],
            default: 'other',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
)

// Add index for better performance when querying by order
gallerySchema.index({ order: 1 })

export default mongoose.models?.Gallery || mongoose.model<IGallery>("Gallery", gallerySchema)