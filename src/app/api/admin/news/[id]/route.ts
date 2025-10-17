import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import News from "@/lib/models/News"
import { authenticate } from "@/lib/middleware/auth"
import { uploadToS3, deleteFromS3 } from "@/lib/utils/s3"

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

// Update news by ID
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
    const newsDate = formData.get("newsDate") as string
    const readMoreButton = formData.get("readMoreButton") as string
    const isActive = formData.get("isActive") === "true"

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
      if (existingNews.image) {
        try {
          await deleteFromS3(existingNews.image)
        } catch (error) {
          console.error("Error deleting old image:", error)
        }
      }

      updateData.image = await uploadToS3(buffer, imageFile.name, imageFile.type)
    } else if (currentImage) {
      // Keep current image
      updateData.image = currentImage
    } else {
      // Remove image
      if (existingNews.image) {
        try {
          await deleteFromS3(existingNews.image)
        } catch (error) {
          console.error("Error deleting image:", error)
        }
      }
      updateData.image = ""
    }

    // Handle video update
    const videoFile = formData.get("video") as File | null
    const currentVideo = formData.get("currentVideo") as string | null

    if (videoFile && videoFile.size > 0) {
      // New video uploaded
      const bytes = await videoFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Validate file type
      if (!videoFile.type.startsWith("video/")) {
        return NextResponse.json({ error: "Only video files are allowed" }, { status: 400 })
      }

      // Validate file size (50MB limit for videos)
      if (videoFile.size > 50 * 1024 * 1024) {
        return NextResponse.json({ error: "Video size must be less than 50MB" }, { status: 400 })
      }

      // Delete old video if exists
      if (existingNews.video) {
        try {
          await deleteFromS3(existingNews.video)
        } catch (error) {
          console.error("Error deleting old video:", error)
        }
      }

      updateData.video = await uploadToS3(buffer, videoFile.name, videoFile.type)
    } else if (currentVideo) {
      // Keep current video
      updateData.video = currentVideo
    } else {
      // Remove video
      if (existingNews.video) {
        try {
          await deleteFromS3(existingNews.video)
        } catch (error) {
          console.error("Error deleting video:", error)
        }
      }
      updateData.video = ""
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
      // Delete image if exists
      if (existingNews.image) {
        await deleteFromS3(existingNews.image)
      }

      // Delete video if exists
      if (existingNews.video) {
        await deleteFromS3(existingNews.video)
      }
    } catch (error) {
      console.error("Error deleting files from S3:", error)
      // Continue with deletion even if S3 deletion fails
    }

    const deletedNews = await News.findByIdAndDelete(id)

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