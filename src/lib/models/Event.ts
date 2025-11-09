// models/Event.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IEvent extends Document {
    title: string
    description: string
    slug: string
    content: string
    bannerImage?: string
    date?: string
    location?: string
    isPastEvent: boolean
    eventImages?: string[]
    order?: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

const EventSchema: Schema = new Schema<IEvent>(
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
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            required: [true, 'Slug is required'],
        },
        bannerImage: {
            type: String,
            trim: true,
            required: false,
        },
        date: {
            type: String,
            trim: true,
            required: false,
        },
        location: {
            type: String,
            trim: true,
            required: false,
            default: 'TBA',
        },
        isPastEvent: {
            type: Boolean,
            default: false,
        },
        content: {
            type: String,
            trim: true,
            required: [true, 'Content is required'],
        },
        eventImages: {
            type: [String],
            required: false,
            default: undefined,
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
EventSchema.pre<IEvent>('save', function (next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }
    next()
})

// Add indexes for better query performance
EventSchema.index({ order: 1, isActive: 1, isPastEvent: 1 })
EventSchema.index({ slug: 1 })
EventSchema.index({ date: -1 })

// Debug middleware
EventSchema.pre<IEvent>('save', function (next) {
    console.log('Saving event with slug:', this.slug)
    console.log('Order:', this.order)
    console.log('Is past event:', this.isPastEvent)
    next()
})

// Clear model cache (important in dev)
delete mongoose.models.Event

export default mongoose.model<IEvent>('Event', EventSchema)