import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Announcement from "@/lib/models/Announcement"
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

    const query: any = {}
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    if (isActive !== null) {
      query.isActive = isActive === "true"
    }

    const skip = (page - 1) * limit
    const announcementList = await Announcement.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await Announcement.countDocuments(query)

    return NextResponse.json({
      announcement: announcementList,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Get announcement error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch announcement" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request)
    await connectDB()

    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const readMoreButton = formData.get("readMoreButton") as string
    const isActive = formData.get("isActive") === "true"
    const imageFile = formData.get("image") as File | null

    let imageUrl = ""

    // Upload image to S3 if provided
    if (imageFile && imageFile.size > 0) {
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

      imageUrl = await uploadToS3(buffer, imageFile.name, imageFile.type)
    }

    const newEntry = await Announcement.create({
      title,
      description,
      image: imageUrl,
      readMoreButton,
      isActive,
    })

    return NextResponse.json(
      {
        message: "Announcement created successfully",
        announcement: newEntry,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Create announcement error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create announcement" },
      { status: error.message === "Authentication failed" ? 401 : 500 },
    )
  }
}
