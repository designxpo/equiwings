// app/api/admin/news/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import News from "@/lib/models/News"
import { authenticate } from "@/lib/middleware/auth"
import { deleteFromS3 } from "@/lib/utils/s3"

// Get news by ID
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

// Update news by ID - Modified for direct S3 upload
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticate(request)
    await connectDB()

    const { id } = await params
    const existingNews = await News.findById(id)

    if (!existingNews) {
      return NextResponse.json({ error: "News not found" }, { status: 404 })
    }

    // Parse JSON body (not FormData)
    const body = await request.json()
    const {
      title,
      description,
      newsDate,
      readMoreButton,
      isActive,
      imageUrl,        // New S3 URL (if uploaded)
      videoUrl,        // New S3 URL (if uploaded)
      removeImage,     // Flag to remove existing image
      removeVideo      // Flag to remove existing video
    } = body

    // Validation
    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    // Check for duplicate slug if title changed
    if (title !== existingNews.title) {
      const newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      const duplicateNews = await News.findOne({ slug: newSlug, _id: { $ne: id } })
      if (duplicateNews) {
        return NextResponse.json({ error: "News with this title already exists" }, { status: 400 })
      }
    }

    const updateData: any = {
      title,
      description,
      newsDate,
      readMoreButton: readMoreButton || "",
      isActive,
    }

    // Handle image update
    if (imageUrl) {
      // New image uploaded - delete old one if exists
      if (existingNews.image) {
        try {
          await deleteFromS3(existingNews.image)
        } catch (error) {
          console.error("Error deleting old image:", error)
        }
      }
      updateData.image = imageUrl
    } else if (removeImage) {
      // Remove image
      if (existingNews.image) {
        try {
          await deleteFromS3(existingNews.image)
        } catch (error) {
          console.error("Error deleting image:", error)
        }
      }
      updateData.image = ""
    } else {
      // Keep existing image
      updateData.image = existingNews.image
    }

    // Handle video update
    if (videoUrl) {
      // New video uploaded - delete old one if exists
      if (existingNews.video) {
        try {
          await deleteFromS3(existingNews.video)
        } catch (error) {
          console.error("Error deleting old video:", error)
        }
      }
      updateData.video = videoUrl
    } else if (removeVideo) {
      // Remove video
      if (existingNews.video) {
        try {
          await deleteFromS3(existingNews.video)
        } catch (error) {
          console.error("Error deleting video:", error)
        }
      }
      updateData.video = ""
    } else {
      // Keep existing video
      updateData.video = existingNews.video
    }

    const updatedNews = await News.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    })

    return NextResponse.json({
      message: "News updated successfully",
      news: updatedNews,
    })
  } catch (error: any) {
    console.error("Update news error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update news" },
      { status: error.message === "Authentication failed" ? 401 : 500 },
    )
  }
}

// Delete news by ID
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticate(request)
    await connectDB()

    const { id } = await params
    const existingNews = await News.findById(id)

    if (!existingNews) {
      return NextResponse.json({ error: "News not found" }, { status: 404 })
    }

    // Delete associated files from S3 before deleting the news
    try {
      if (existingNews.image) {
        await deleteFromS3(existingNews.image)
      }
      if (existingNews.video) {
        await deleteFromS3(existingNews.video)
      }
    } catch (error) {
      console.error("Error deleting files from S3:", error)
    }

    await News.findByIdAndDelete(id)

    return NextResponse.json({
      message: "News deleted successfully",
    })
  } catch (error: any) {
    console.error("Delete news error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete news" },
      { status: error.message === "Authentication failed" ? 401 : 500 },
    )
  }
}