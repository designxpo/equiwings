import mongoose, { type Document, Schema } from "mongoose";

export interface IContact extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    countryCode: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
}

const ContactSchema: Schema = new Schema(
    {
        firstName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
            required: false,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        phoneNumber: {
            type: String,
            required: false,
            trim: true,
            validate: {
                validator: function (value: string) {
                    return /^[0-9+\-\s()]+$/.test(value);
                },
                message: "Please enter a valid phone number",
            },
        },
        countryCode: {
            type: String,
            required: false,
        },
        message: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Add indexes for better query performance
ContactSchema.index({ email: 1 });
ContactSchema.index({ createdAt: -1 });


export default mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);

