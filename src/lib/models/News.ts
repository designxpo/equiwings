// models/News.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface INews extends Document {
    title: string
    description: string
    newsDate?: string
    newsType: 'primary' | 'secondary'
    image?: string
    readMoreButton?: string
    video?: string
    isActive: boolean
    slug: string
    createdAt: Date
    updatedAt: Date
}

const NewsSchema: Schema = new Schema<INews>({
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
    newsDate: {
        type: String,
        required: false,
        trim: true
    },
    newsType: {
        type: String,
        enum: {
            values: ['primary', 'secondary'],
            message: 'News type must be either "primary" or "secondary"'
        },
        required: [true, 'News type is required'],
        default: 'primary'
    },
    image: {
        type: String,
        trim: true,
        default: ''
    },
    readMoreButton: {
        type: String,
        trim: true,
        default: ''
    },
    video: {
        type: String,
        trim: true,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    }
}, {
    timestamps: true
})

// Pre-save middleware to generate slug
NewsSchema.pre<INews>('save', function (next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }
    next()
})

// Add validation middleware for debugging
NewsSchema.pre<INews>('save', function (next) {
    console.log('Saving news with newsType:', this.newsType)
    console.log('Type of newsType:', typeof this.newsType)
    next()
})

// Clear the model cache if it exists (important for development)
delete mongoose.models.News

export default mongoose.model<INews>('News', NewsSchema)