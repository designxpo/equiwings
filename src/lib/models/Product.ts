import mongoose, { type Document, Schema } from "mongoose"

export interface IProduct extends Document {
  productId: string
  name: string
  description: string
  category: string
  price: number
  sizes: string[]
  colors: string[]
  quantity: number
  mainImage: string
  additionalImages: string[]
  ratings: {
    average: number
    count: number
  }
  reviews: {
    reviewerName: string
    rating: number
    comment: string
    createdAt: Date
  }[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    productId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      // enum: ["PANTS", "TSHIRTS", "CAPS", "BAGS", "ACCESSORIES"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    sizes: [
      {
        type: String,
        trim: true,
        uppercase: true,
      },
    ],
    colors: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    mainImage: {
      type: String,
      required: true,
    },
    additionalImages: [
      {
        type: String,
        validate: {
          validator: (v: string[]) => v.length <= 5,
          message: "Maximum 5 additional images allowed",
        },
      },
    ],
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    reviews: [
      {
        reviewerName: {
          type: String,
          required: true,
          trim: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          required: true,
          trim: true,
          maxlength: 1000,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Update ratings when reviews change
productSchema.methods.updateRatings = function () {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum: number, review: any) => sum + review.rating, 0)
    this.ratings.average = totalRating / this.reviews.length
    this.ratings.count = this.reviews.length
  } else {
    this.ratings.average = 0
    this.ratings.count = 0
  }
}

export default mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema)
