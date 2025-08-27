import mongoose, { type Document, Schema } from "mongoose"

export interface ICartItem {
  product: mongoose.Types.ObjectId
  quantity: number
  size?: string
  color?: string
  price: number
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId
  items: ICartItem[]
  totalAmount: number
  createdAt: Date
  updatedAt: Date
  calculateTotal(): void
}

const cartItemSchema = new Schema<ICartItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  size: {
    type: String,
    trim: true,
    uppercase: true,
  },
  color: {
    type: String,
    trim: true,
    lowercase: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
})

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Calculate total amount
cartSchema.methods.calculateTotal = function () {
  this.totalAmount = this.items.reduce((total: number, item: ICartItem) => {
    return total + item.price * item.quantity
  }, 0)
}

// Update total before saving
cartSchema.pre("save", function (next) {
  this.calculateTotal()
  next()
})

export default mongoose.models.Cart || mongoose.model<ICart>("Cart", cartSchema)
