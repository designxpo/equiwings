import mongoose, { Schema, type Document } from "mongoose"

export interface IBlog extends Document {
    title: string
    slug: string
    content: string
    featuredImage?: string
    author: mongoose.Types.ObjectId
    category: string
    status: "draft" | "published" | "archived"
    publishedAt?: Date
    // SEO Fields
    metaTitle?: string
    metaDescription?: string
    metaKeywords?: string
    createdAt: Date
    updatedAt: Date
}

const blogSchema = new Schema<IBlog>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [200, "Title cannot exceed 200 characters"],
        },
        slug: {
            type: String,
            required: [true, "Slug is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly"],
        },
        content: {
            type: String,
            required: [true, "Content is required"],
        },
        featuredImage: {
            type: String,
            default: null,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Author is required"],
        },
        category: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            enum: ["draft", "published", "archived"],
            default: "draft",
        },
        publishedAt: {
            type: Date,
            default: null,
        },
        // SEO Fields
        metaTitle: {
            type: String,
            trim: true,
            maxlength: [60, "Meta title should not exceed 60 characters"],
            default: null,
        },
        metaDescription: {
            type: String,
            trim: true,
            maxlength: [160, "Meta description should not exceed 160 characters"],
            default: null,
        },
        metaKeywords: {
            type: String,
            trim: true,
            default: null,
        },
    },
    {
        timestamps: true,
    },
)


// Pre-save middleware to auto-set publishedAt when status changes to published
blogSchema.pre('save', function (next) {
    if (this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});

// Indexes for better performance
blogSchema.index({ slug: 1 })
blogSchema.index({ author: 1 })
blogSchema.index({ category: 1 })
blogSchema.index({ status: 1 })
blogSchema.index({ publishedAt: -1 })
blogSchema.index({ createdAt: -1 })
blogSchema.index({ metaKeywords: 1 })

const Blog = mongoose.models.Blog || mongoose.model<IBlog>("Blog", blogSchema)

export default Blog