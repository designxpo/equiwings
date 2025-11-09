// models/Slide.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface ISlide extends Document {
    title: string
    description: string
    content: string
    video?: string
    thumbnail: string
    slug: string
    order?: number
    buttons?: Array<{
        text: string
        link: string
    }>
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

const SlideSchema: Schema = new Schema<ISlide>(
    {
        title: {
            type: String,
            trim: true,
            required: [true, 'Title is required'],
        },
        description: {
            type: String,
            trim: true,
            required: [true, 'Description is required'],
        },
        content: {
            type: String,
            trim: true,
            required: [true, 'Content is required'],
        },
        video: {
            type: String,
            trim: true,
            required: false,
        },
        buttons: {
            type: [
                {
                    text: {
                        type: String,
                        trim: true,
                        required: [true, 'Button text is required'],
                    },
                    link: {
                        type: String,
                        trim: true,
                        required: [true, 'Button link is required'],
                    },
                },
            ],
            required: false,
            default: undefined,
        },
        thumbnail: {
            type: String,
            trim: true,
            required: [true, 'Thumbnail image is required'],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            required: [true, 'Slug is required'],
        },
        order: {
            type: Number,
            required: false,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
)

// Pre-save middleware to generate slug from title if not provided
SlideSchema.pre<ISlide>('save', function (next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }
    next()
})

// Add index for better query performance
SlideSchema.index({ order: 1, isActive: 1 })

// Debug middleware
SlideSchema.pre<ISlide>('save', function (next) {
    console.log('Saving slide with slug:', this.slug)
    console.log('Order:', this.order)
    next()
})

// Clear model cache (important in dev)
delete mongoose.models.Slide

export default mongoose.model<ISlide>('Slide', SlideSchema)
