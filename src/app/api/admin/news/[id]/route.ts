// api/admin/news/[id]/route.ts
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

    // Now receiving JSON instead of FormData
    const body = await request.json()
    const { title, description, newsDate, readMoreButton, isActive, image, video } = body

    // Validation
    if (!title?.trim() || !description?.trim()) {
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

      existingNews.slug = newSlug
    }

    const updateData: any = {
      title: title.trim(),
      description: description.trim(),
      newsDate: newsDate?.trim() || "",
      readMoreButton: readMoreButton?.trim() || "",
      isActive: isActive ?? true,
    }

    // Handle image update
    if (image && image !== existingNews.image) {
      // New image uploaded, delete old one if exists
      if (existingNews.image) {
        try {
          await deleteFromS3(existingNews.image)
        } catch (error) {
          console.error("Error deleting old image:", error)
        }
      }
      updateData.image = image
    } else if (!image && existingNews.image) {
      // Image removed
      try {
        await deleteFromS3(existingNews.image)
      } catch (error) {
        console.error("Error deleting image:", error)
      }
      updateData.image = ""
    } else {
      // Keep existing image
      updateData.image = existingNews.image || ""
    }

    // Handle video update
    if (video && video !== existingNews.video) {
      // New video uploaded, delete old one if exists
      if (existingNews.video) {
        try {
          await deleteFromS3(existingNews.video)
        } catch (error) {
          console.error("Error deleting old video:", error)
        }
      }
      updateData.video = video
    } else if (!video && existingNews.video) {
      // Video removed
      try {
        await deleteFromS3(existingNews.video)
      } catch (error) {
        console.error("Error deleting video:", error)
      }
      updateData.video = ""
    } else {
      // Keep existing video
      updateData.video = existingNews.video || ""
    }

    // Update the news entry
    const updatedNews = await News.findByIdAndUpdate(id, updateData, { new: true })

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
