import mongoose, { type Document, Schema } from "mongoose"

export interface ISponsorLogo extends Document {
    name?: string
    logo_url: string
    website?: string
    description?: string
    type: string
    status: 'active' | 'inactive'
    order: number
    createdAt: Date
    updatedAt: Date
}

const sponsorLogoSchema = new Schema<ISponsorLogo>(
    {
        name: {
            type: String,
            trim: true,
            maxlength: 100,
        },
        logo_url: {
            type: String,
            required: true,
            trim: true,
        },
        website: {
            type: String,
            trim: true,
            default: '',
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        type: {
            type: String,
            default: 'partner',
            trim: true,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
)

// Compound index for unique active sponsors by type and order
sponsorLogoSchema.index({ type: 1, order: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'active' } })

export default mongoose.models?.SponsorLogo || mongoose.model<ISponsorLogo>("SponsorLogo", sponsorLogoSchema)