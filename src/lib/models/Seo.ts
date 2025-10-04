import mongoose, { type Document, Schema } from "mongoose"

export interface ISeo extends Document {
    type: string
    metaTitle: string
    metaDescription: string
    metaKeywords: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

// Predefined page types
export const PAGE_TYPES = [
    {
        value: 'home',
        label: 'Home',
    },
    {
        value: 'sports-and-events',
        label: 'Sports and Events',
    },
    {
        value: 'sports-retail',
        label: 'Sports Retail',
    },
    {
        value: 'services',
        label: 'Services',
    },
    {
        value: 'gallery',
        label: 'Gallery',
    },
    {
        value: 'blogs',
        label: 'Blogs',
    },
    {
        value: 'about-us',
        label: 'About Us',
    },
] as const

const seoSchema = new Schema<ISeo>(
    {
        type: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        metaTitle: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },
        metaDescription: {
            type: String,
            required: true,
            trim: true,
            maxlength: 300,
        },
        metaKeywords: {
            type: String,
            required: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
)
export default mongoose.models?.Seo || mongoose.model<ISeo>("Seo", seoSchema)
