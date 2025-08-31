// models/Registration.ts
import mongoose, { Schema, Document } from 'mongoose';

// Interfaces for TypeScript
export interface IRider {
    name: string;
    efiId?: string;
    dateOfBirth: Date;
    age: number;
    gender: 'male' | 'female';
    ageCategory: string;
    ageCategoryName: string;
}

export interface IRegistration extends Document {
    competitionType: 'ghs' | 'ncr' | 'uphs';
    registrationType: 'individual' | 'team';
    teamName?: string;
    riders: IRider[];
    events: string[];
    parentName?: string;
    coachName?: string;
    totalFee: number;
    gstAmount: number;
    finalAmount: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'failed';
    registrationNumber?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Rider Schema
const RiderSchema = new Schema<IRider>({
    name: {
        type: String,
        required: [true, 'Rider name is required'],
        trim: true,
        minlength: [2, 'Rider name must be at least 2 characters'],
        maxlength: [100, 'Rider name cannot exceed 100 characters']
    },
    efiId: {
        type: String,
        trim: true,
        uppercase: true,
        match: [/^[A-Z0-9]*$/, 'EFI ID must contain only alphanumeric characters']
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required'],
        validate: {
            validator: function (date: Date) {
                const today = new Date();
                const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
                const maxDate = new Date(today.getFullYear() - 4, today.getMonth(), today.getDate());
                return date >= minDate && date <= maxDate;
            },
            message: 'Invalid date of birth. Rider must be between 4 and 100 years old'
        }
    },
    age: {
        type: Number,
        required: true,
        min: [4, 'Minimum age is 4 years'],
        max: [100, 'Maximum age is 100 years']
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: {
            values: ['male', 'female'],
            message: 'Gender must be either male or female'
        }
    },
    ageCategory: {
        type: String,
        required: [true, 'Age category is required'],
        enum: {
            values: ['young_rider', 'junior_rider', 'children_gp1', 'children_gp2', 'children_gp3',
                'children_gp4', 'children_gp5', 'children_gp6', 'children_gp7', 'senior', 'ladies', 'all'],
            message: 'Invalid age category'
        }
    },
    ageCategoryName: {
        type: String,
        required: true
    }
});

// Main Registration Schema
const RegistrationSchema = new Schema<IRegistration>({
    competitionType: {
        type: String,
        required: [true, 'Competition type is required'],
        enum: {
            values: ['ghs', 'ncr', 'uphs'],
            message: 'Competition type must be GHS, NCR, or UPHS'
        }
    },
    registrationType: {
        type: String,
        required: [true, 'Registration type is required'],
        enum: {
            values: ['individual', 'team'],
            message: 'Registration type must be individual or team'
        }
    },
    teamName: {
        type: String,
        trim: true,
        minlength: [2, 'Team name must be at least 2 characters'],
        maxlength: [100, 'Team name cannot exceed 100 characters'],
        required: function (this: IRegistration) {
            return this.registrationType === 'team';
        }
    },
    riders: {
        type: [RiderSchema],
        required: true,
        validate: [
            {
                validator: function (riders: IRider[]) {
                    return riders.length >= 1;
                },
                message: 'At least one rider is required'
            },
            {
                validator: function (this: IRegistration, riders: IRider[]) {
                    if (this.registrationType === 'team') {
                        return riders.length >= 2 && riders.length <= 4;
                    }
                    return riders.length === 1;
                },
                message: 'Team registration requires 2-4 riders, individual registration requires exactly 1 rider'
            }
        ]
    },
    events: {
        type: [String],
        required: true,
        validate: {
            validator: function (events: string[]) {
                return events.length > 0;
            },
            message: 'At least one event must be selected'
        }
    },
    parentName: {
        type: String,
        trim: true,
        maxlength: [100, 'Parent name cannot exceed 100 characters']
    },
    coachName: {
        type: String,
        trim: true,
        maxlength: [100, 'Coach name cannot exceed 100 characters']
    },
    totalFee: {
        type: Number,
        required: true,
        min: [0, 'Total fee cannot be negative']
    },
    gstAmount: {
        type: Number,
        required: true,
        min: [0, 'GST amount cannot be negative']
    },
    finalAmount: {
        type: Number,
        required: true,
        min: [0, 'Final amount cannot be negative']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    registrationNumber: {
        type: String,
        unique: true,
        sparse: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Pre-save middleware to calculate amounts and generate registration number
RegistrationSchema.pre('save', function (next) {
    // Calculate GST (18%)
    this.gstAmount = Math.round(this.totalFee * 0.18);
    this.finalAmount = this.totalFee + this.gstAmount;

    // Generate registration number if not exists
    if (!this.registrationNumber) {
        const year = new Date().getFullYear();
        const competitionPrefix = this.competitionType.toUpperCase();
        const typePrefix = this.registrationType === 'team' ? 'T' : 'I';
        const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.registrationNumber = `${competitionPrefix}-${year}-${typePrefix}-${randomNumber}`;
    }

    next();
});

// Indexes for better query performance
RegistrationSchema.index({ competitionType: 1, registrationType: 1 });
RegistrationSchema.index({ registrationNumber: 1 }, { unique: true });
RegistrationSchema.index({ createdAt: -1 });
RegistrationSchema.index({ 'riders.name': 'text', 'teamName': 'text' });

// Virtual for formatted registration number
RegistrationSchema.virtual('formattedRegistrationNumber').get(function () {
    return this.registrationNumber || 'Pending';
});

// Virtual for event count
RegistrationSchema.virtual('eventCount').get(function () {
    return this.events.length;
});

// Static method to find by competition type
RegistrationSchema.statics.findByCompetition = function (competitionType: string) {
    return this.find({ competitionType });
};

// Instance method to calculate fee
RegistrationSchema.methods.calculateFee = function () {
    const baseRate = this.registrationType === 'team' ? 2000 : 1000;
    this.totalFee = baseRate * this.events.length;
    this.gstAmount = Math.round(this.totalFee * 0.18);
    this.finalAmount = this.totalFee + this.gstAmount;
    return this.finalAmount;
};

// Export the model
const Registration = mongoose.models.Registration || mongoose.model<IRegistration>('Registration', RegistrationSchema);

export default Registration;