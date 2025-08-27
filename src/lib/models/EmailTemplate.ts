import mongoose, { type Document, Schema } from "mongoose"

export interface IEmailTemplate extends Document {
  name: string
  subject: string
  htmlContent: string
  textContent: string
  variables: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const emailTemplateSchema = new Schema<IEmailTemplate>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    htmlContent: {
      type: String,
      required: true,
    },
    textContent: {
      type: String,
      required: true,
    },
    variables: [
      {
        type: String,
        trim: true,
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

export default mongoose.models.EmailTemplate || mongoose.model<IEmailTemplate>("EmailTemplate", emailTemplateSchema)
