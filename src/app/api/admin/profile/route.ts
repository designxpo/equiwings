import { authenticate, authorize } from '@/lib/middleware/auth'
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connection'
import User from '@/lib/models/User'

export async function GET(request: NextRequest) {
    try {
        const user = await authenticate(request)
        // await authorize(user, "PROFILE", "READ")
        await connectDB()

        const profile = await User.findById(user.id)
            .select('-password -emailVerificationToken -passwordResetToken')
            .populate('role', 'name')

        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            )
        }

        // Update last login
        await User.findByIdAndUpdate(user.id, { lastLogin: new Date() })

        return NextResponse.json({ profile })
    } catch (error: any) {
        console.error("Get profile error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to fetch profile" },
            { status: error.message === "Authentication failed" ? 401 : 500 }
        )
    }
}

export async function PUT(request: NextRequest) {
    try {
        const user = await authenticate(request)
        // await authorize(user, "PROFILE", "UPDATE")
        await connectDB()

        const body = await request.json()

        // Remove sensitive fields that shouldn't be updated via this endpoint
        const { password, role, isEmailVerified, emailVerificationToken, passwordResetToken, passwordResetExpires, ...updateData } = body

        const updatedProfile = await User.findByIdAndUpdate(
            user.id,
            { $set: updateData },
            { new: true, runValidators: true }
        )
            .select('-password -emailVerificationToken -passwordResetToken')
            .populate('role', 'name')

        if (!updatedProfile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ profile: updatedProfile })
    } catch (error: any) {
        console.error("Update profile error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to update profile" },
            { status: error.message === "Validation failed" ? 400 : 500 }
        )
    }
}
