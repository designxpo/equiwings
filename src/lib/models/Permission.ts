import mongoose, { type Document, Schema } from "mongoose"

export interface IPermission extends Document {
  name: string
  description: string
  resource: string
  action: string
  createdAt: Date
  updatedAt: Date
}

const permissionSchema = new Schema<IPermission>(
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
    resource: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      enum: ["CREATE", "READ", "UPDATE", "DELETE", "MANAGE"],
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Permission || mongoose.model<IPermission>("Permission", permissionSchema)
