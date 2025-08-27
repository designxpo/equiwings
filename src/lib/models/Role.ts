import mongoose, { type Document, Schema } from "mongoose"

export interface IRole extends Document {
  name: string
  description: string
  permissions: mongoose.Types.ObjectId[]
  level: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      required: true,
      default: "2",
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Role || mongoose.model<IRole>("Role", roleSchema)
