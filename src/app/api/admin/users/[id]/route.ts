import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import User from "@/lib/models/User"
import Role from "@/lib/models/Role"
import { authenticate, authorize } from "@/lib/middleware/auth"

// Get user
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await authenticate(request)
        // await authorize(user, "PROFILE", "READ")
        await connectDB()

        const { id } = await params

        // Check if user exists
        const existingUser = await User.findById(id)
            .populate("role", "name description")
            .select("-password -emailVerificationToken -passwordResetToken")
        if (!existingUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                message: "User retrieved successfully",
                user: existingUser,
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error("Get user error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to retrieve user" },
            { status: error.message === "Authentication failed" ? 401 : 500 }
        )
    }
}

// Update user
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await authenticate(request)
        await authorize(user, "USER", "UPDATE")
        await connectDB()

        const { id } = await params
        const body = await request.json()
        const { firstName, lastName, email, phoneNumber, countryCode, role } = body

        // Check if user exists
        const existingUser = await User.findById(id)
        if (!existingUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        // If email is being updated, check if it's already taken by another user
        if (email && email !== existingUser.email) {
            const emailExists = await User.findOne({
                email,
                _id: { $ne: id }
            })
            if (emailExists) {
                return NextResponse.json(
                    { error: "Email already exists" },
                    { status: 400 }
                )
            }
        }

        // Build update object
        const updateData: any = {}
        if (firstName !== undefined) updateData.firstName = firstName
        if (lastName !== undefined) updateData.lastName = lastName
        if (email !== undefined) updateData.email = email
        if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber
        if (countryCode !== undefined) updateData.countryCode = countryCode

        // Handle role update if provided
        if (role) {
            const roleDoc = await Role.findOne({ name: role.toUpperCase() })
            if (roleDoc) {
                updateData.role = roleDoc._id
            } else {
                return NextResponse.json(
                    { error: "Invalid role specified" },
                    { status: 400 }
                )
            }
        }

        // Update the user
        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )
            .populate("role", "name description")
            .select("-password -emailVerificationToken -passwordResetToken")

        return NextResponse.json(
            {
                message: "User updated successfully",
                user: updatedUser,
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error("Update user error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to update user" },
            { status: error.message === "Authentication failed" ? 401 : 500 }
        )
    }
}

// Delete user
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await authenticate(request)
        await authorize(user, "USER", "DELETE")
        await connectDB()

        // Await params
        const { id } = await params

        // Check if user exists
        const existingUser = await User.findById(id)
        if (!existingUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        // Prevent self-deletion
        if (existingUser._id.toString() === user._id.toString()) {
            return NextResponse.json(
                { error: "Cannot delete your own account" },
                { status: 400 }
            )
        }

        // Delete the user
        await User.findByIdAndDelete(id)

        return NextResponse.json(
            { message: "User deleted successfully" },
            { status: 200 }
        )
    } catch (error: any) {
        console.error("Delete user error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to delete user" },
            { status: error.message === "Authentication failed" ? 401 : 500 }
        )
    }
}

