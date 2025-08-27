import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import News from "@/lib/models/News"
import { authenticate } from "@/lib/middleware/auth"
import { uploadToS3, deleteFromS3 } from "@/lib/utils/s3"

// Get news
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await authenticate(request)
        await connectDB()
        const { id } = await params

        const existingNews = await News.findById(id)
        if (!existingNews) {
            return NextResponse.json({ error: "News not found" }, { status: 404 })
        }

        return NextResponse.json(
            {
                message: "News retrieved successfully",
                news: existingNews,
            },
            { status: 200 },
        )
    } catch (error: any) {
        console.error("Get news error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to retrieve news" },
            { status: error.message === "Authentication failed" ? 401 : 500 },
        )
    }
}

// Update news
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await authenticate(request)
        await connectDB()
        const { id } = await params

        const existingNews = await News.findById(id)
        if (!existingNews) {
            return NextResponse.json({ error: "News not found" }, { status: 404 })
        }

        const formData = await request.formData()
        const title = formData.get("title") as string
        const description = formData.get("description") as string
        const readMoreButton = formData.get("readMoreButton") as string
        const isActive = formData.get("isActive") === "true"
        const imageFile = formData.get("image") as File | null

        // If title is being updated, check if slug would conflict
        if (title && title !== existingNews.title) {
            const newSlug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")

            const slugExists = await News.findOne({
                slug: newSlug,
                _id: { $ne: id },
            })

            if (slugExists) {
                return NextResponse.json({ error: "A news article with this title already exists" }, { status: 400 })
            }
        }

        // Build update object
        const updateData: any = {}
        if (title !== undefined) updateData.title = title
        if (description !== undefined) updateData.description = description
        if (readMoreButton !== undefined) updateData.readMoreButton = readMoreButton
        if (isActive !== undefined) updateData.isActive = isActive

        // Handle image upload
        if (imageFile && imageFile.size > 0) {
            // Validate file type
            if (!imageFile.type.startsWith("image/")) {
                return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
            }

            // Validate file size (5MB limit)
            if (imageFile.size > 5 * 1024 * 1024) {
                return NextResponse.json({ error: "Image size must be less than 5MB" }, { status: 400 })
            }

            // Delete old image if exists
            if (existingNews.image) {
                try {
                    await deleteFromS3(existingNews.image)
                } catch (error) {
                    console.error("Error deleting old image:", error)
                }
            }

            // Upload new image
            const bytes = await imageFile.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const imageUrl = await uploadToS3(buffer, imageFile.name, imageFile.type)
            updateData.image = imageUrl
        }

        const updatedNews = await News.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

        return NextResponse.json(
            {
                message: "News updated successfully",
                news: updatedNews,
            },
            { status: 200 },
        )
    } catch (error: any) {
        console.error("Update news error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to update news" },
            { status: error.message === "Authentication failed" ? 401 : 500 },
        )
    }
}

// Delete news
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await authenticate(request)
        await connectDB()
        const { id } = await params

        const existingNews = await News.findById(id)
        if (!existingNews) {
            return NextResponse.json({ error: "News not found" }, { status: 404 })
        }

        // Delete image from S3 if exists
        if (existingNews.image) {
            try {
                await deleteFromS3(existingNews.image)
            } catch (error) {
                console.error("Error deleting image from S3:", error)
            }
        }

        await News.findByIdAndDelete(id)

        return NextResponse.json({ message: "News deleted successfully" }, { status: 200 })
    } catch (error: any) {
        console.error("Delete news error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to delete news" },
            { status: error.message === "Authentication failed" ? 401 : 500 },
        )
    }
}
