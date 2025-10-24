// app/api/admin/news/route.ts
import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import News from "@/lib/models/News"
import { authenticate } from "@/lib/middleware/auth"

// Configure route segment
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

// NEW APPROACH: Accept file URLs instead of file uploads
export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request)
    await connectDB()

    // Parse JSON body (not FormData anymore)
    const body = await request.json()
    const {
      title,
      description,
      newsDate,
      newsType,
      readMoreButton,
      isActive = true,
      imageUrl,  // S3 URL from client upload
      videoUrl   // S3 URL from client upload
    } = body

    // Validation
    if (!title?.trim() || !description?.trim() || !newsType?.trim()) {
      return NextResponse.json(
        { error: "Title, description, and news type are required" },
        { status: 400 },
      )
    }

    if (!["primary", "secondary"].includes(newsType)) {
      return NextResponse.json({ error: "Invalid news type" }, { status: 400 })
    }

    const newsData: any = {
      title: title.trim(),
      description: description.trim(),
      newsDate: newsDate?.trim() || "",
      newsType: newsType.trim(),
      readMoreButton: readMoreButton?.trim() || "",
      isActive,
      image: imageUrl || "",  // Store S3 URL directly
      video: videoUrl || ""   // Store S3 URL directly
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