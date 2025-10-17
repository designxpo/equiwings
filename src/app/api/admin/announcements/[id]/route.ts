import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Announcement from "@/lib/models/Announcement"
import { authenticate } from "@/lib/middleware/auth"
import { uploadToS3, deleteFromS3 } from "@/lib/utils/s3"

// Get announcement
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticate(request)
    await connectDB()
    const { id } = await params

    const existingAnnouncement = await Announcement.findById(id)
    if (!existingAnnouncement) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        message: "Announcement retrieved successfully",
        announcement: existingAnnouncement,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Get announcement error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to retrieve announcement" },
      { status: error.message === "Authentication failed" ? 401 : 500 },
    )
  }
}

// Update announcement
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticate(request)
    await connectDB()
    const { id } = await params

    const existingAnnouncement = await Announcement.findById(id)
    if (!existingAnnouncement) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 })
    }

    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const readMoreButton = formData.get("readMoreButton") as string
    const isActive = formData.get("isActive") === "true"
    const imageFile = formData.get("image") as File | null

    // If title is being updated, check if slug would conflict
    if (title && title !== existingAnnouncement.title) {
      const newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")

      const slugExists = await Announcement.findOne({
        slug: newSlug,
        _id: { $ne: id },
      })

      if (slugExists) {
        return NextResponse.json({ error: "An announcement with this title already exists" }, { status: 400 })
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
      if (existingAnnouncement.image) {
        try {
          await deleteFromS3(existingAnnouncement.image)
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

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

    return NextResponse.json(
      {
        message: "Announcement updated successfully",
        announcement: updatedAnnouncement,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Update announcement error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update announcement" },
      { status: error.message === "Authentication failed" ? 401 : 500 },
    )
  }
}

// Delete announcement
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticate(request)
    await connectDB()
    const { id } = await params

    const existingAnnouncement = await Announcement.findById(id)
    if (!existingAnnouncement) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 })
    }

    // Delete image from S3 if exists
    if (existingAnnouncement.image) {
      try {
        await deleteFromS3(existingAnnouncement.image)
      } catch (error) {
        console.error("Error deleting image from S3:", error)
      }
    }

    await Announcement.findByIdAndDelete(id)

    return NextResponse.json({ message: "Announcement deleted successfully" }, { status: 200 })
  } catch (error: any) {
    console.error("Delete announcement error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete announcement" },
      { status: error.message === "Authentication failed" ? 401 : 500 },
    )
  }
}
