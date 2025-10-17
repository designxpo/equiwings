// api/admin/gallery/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Gallery from "@/lib/models/Gallery"
import { authenticate } from "@/lib/middleware/auth"
import { uploadToS3, deleteFromS3 } from "@/lib/utils/s3"

// Get gallery by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await authenticate(request)
        await connectDB()
        const { id } = await params

        const existingGallery = await Gallery.findById(id)
        if (!existingGallery) {
            return NextResponse.json({ error: "Gallery item not found" }, { status: 404 })
        }

        return NextResponse.json(
            {
                message: "Gallery item retrieved successfully",
                gallery: existingGallery,
            },
            { status: 200 },
        )
    } catch (error: any) {
        console.error("Get gallery error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to retrieve gallery item" },
            { status: error.message === "Authentication failed" ? 401 : 500 },
        )
    }
}

// api/admin/gallery/[id]/route.ts - PUT function
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await authenticate(request)
        await connectDB()

        const { id } = await params
        const existingGallery = await Gallery.findById(id)

        if (!existingGallery) {
            return NextResponse.json({ error: "Gallery item not found" }, { status: 404 })
        }

        const formData = await request.formData()
        const title = formData.get("title") as string
        const category = formData.get("category") as string
        const isActive = formData.get("isActive") === "true"
        const orderRaw = formData.get("order") as string | null

        // Validation
        if (!title || !category) {
            return NextResponse.json(
                { error: "Title and category are required" },
                { status: 400 }
            )
        }

        if (!["sports", "events", "facilities", "achievements", "training", "other"].includes(category)) {
            return NextResponse.json({ error: "Invalid category" }, { status: 400 })
        }

        // Handle order field
        let order = existingGallery.order // Default to existing order
        if (orderRaw !== null && orderRaw.trim() !== "") {
            order = Number.parseInt(orderRaw)
            if (isNaN(order)) {
                return NextResponse.json({ error: "Order must be a number" }, { status: 400 })
            }
        }

        const updateData: any = {
            title,
            category,
            isActive,
            order, // Add order field
        }

        // Handle image update
        const imageFile = formData.get("image") as File | null
        const currentImage = formData.get("currentImage") as string | null

        if (imageFile && imageFile.size > 0) {
            // New image uploaded
            const bytes = await imageFile.arrayBuffer()
            const buffer = Buffer.from(bytes)

            // Validate file type
            if (!imageFile.type.startsWith("image/")) {
                return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
            }

            // Validate file size (5MB limit)
            if (imageFile.size > 5 * 1024 * 1024) {
                return NextResponse.json({ error: "Image size must be less than 5MB" }, { status: 400 })
            }

            // Delete old image if exists
            if (existingGallery.image) {
                try {
                    await deleteFromS3(existingGallery.image)
                } catch (error) {
                    console.error("Error deleting old image:", error)
                }
            }

            updateData.image = await uploadToS3(buffer, imageFile.name, imageFile.type)
        } else if (currentImage) {
            // Keep current image
            updateData.image = currentImage
        } else {
            // Image is required, cannot remove
            return NextResponse.json({ error: "Image is required" }, { status: 400 })
        }

        const updatedGallery = await Gallery.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        })

        return NextResponse.json({
            message: "Gallery item updated successfully",
            gallery: updatedGallery,
        })
    } catch (error: any) {
        console.error("Update gallery error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to update gallery item" },
            { status: error.message === "Authentication failed" ? 401 : 500 },
        )
    }
}

// Delete gallery by ID
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await authenticate(request)
        await connectDB()

        const { id } = await params
        const existingGallery = await Gallery.findById(id)

        if (!existingGallery) {
            return NextResponse.json({ error: "Gallery item not found" }, { status: 404 })
        }

        // Delete associated image from S3 before deleting the gallery item
        try {
            if (existingGallery.image) {
                await deleteFromS3(existingGallery.image)
            }
        } catch (error) {
            console.error("Error deleting image from S3:", error)
            // Continue with deletion even if S3 deletion fails
        }

        await Gallery.findByIdAndDelete(id)

        return NextResponse.json({
            message: "Gallery item deleted successfully",
        })
    } catch (error: any) {
        console.error("Delete gallery error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to delete gallery item" },
            { status: error.message === "Authentication failed" ? 401 : 500 },
        )
    }
}