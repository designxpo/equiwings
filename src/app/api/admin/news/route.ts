// api/admin/news/route.ts
import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import News from "@/lib/models/News"
import { authenticate } from "@/lib/middleware/auth"
import { uploadToS3 } from "@/lib/utils/s3"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const isActive = searchParams.get("isActive")
    const newsType = searchParams.get("newsType")

    const query: any = {}
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    if (isActive !== null) {
      query.isActive = isActive === "true"
    }

    if (newsType) {
      query.newsType = newsType
    }

    const skip = (page - 1) * limit
    const newsList = await News.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await News.countDocuments(query)

    return NextResponse.json({
      news: newsList,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Get news error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch news" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request)
    await connectDB()

    const formData = await request.formData()
    const title = (formData.get("title") as string)?.trim()
    const description = (formData.get("description") as string)?.trim()
    const newsDate = (formData.get("newsDate") as string)?.trim()
    const newsType = (formData.get("newsType") as string)?.trim()
    const readMoreButton = (formData.get("readMoreButton") as string)?.trim()
    const isActiveRaw = formData.get("isActive")
    const isActive = isActiveRaw ? isActiveRaw === "true" : true // fallback to schema default

    // Validation
    if (!title || !description || !newsType) {
      return NextResponse.json(
        { error: "Title, description, and news type are required" },
        { status: 400 },
      )
    }

    if (!["primary", "secondary"].includes(newsType)) {
      return NextResponse.json({ error: "Invalid news type" }, { status: 400 })
    }

    const newsData: any = {
      title,
      description,
      newsDate,
      newsType,
      readMoreButton: readMoreButton || "",
      isActive,
    }

    // Handle image upload
    const imageFile = formData.get("image") as File | null
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      if (!imageFile.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
      }

      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "Image size must be less than 5MB" }, { status: 400 })
      }

      newsData.image = await uploadToS3(buffer, imageFile.name, imageFile.type)
    }

    // Handle video upload
    const videoFile = formData.get("video") as File | null
    if (videoFile && videoFile.size > 0) {
      const bytes = await videoFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      if (!videoFile.type.startsWith("video/")) {
        return NextResponse.json({ error: "Only video files are allowed" }, { status: 400 })
      }

      if (videoFile.size > 50 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Video size must be less than 50MB" },
          { status: 400 },
        )
      }

      newsData.video = await uploadToS3(buffer, videoFile.name, videoFile.type)
    }

    const newEntry = await News.create(newsData)

    return NextResponse.json(
      {
        message: "News created successfully",
        news: newEntry,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Create news error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create news" },
      { status: error.message === "Authentication failed" ? 401 : 500 },
    )
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100mb", // or whatever limit you want (e.g. 200mb)
    },
  },
}