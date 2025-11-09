// api/admin/slides/route.ts
import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Slide from "@/lib/models/Slide"
import { authenticate } from "@/lib/middleware/auth"
import { uploadToS3 } from "@/lib/utils/s3"

// GET - Fetch all slides
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
            query.title = { $regex: search, $options: "i" }
        }

        if (isActive !== null) {
            query.isActive = isActive === "true"
        }

        const skip = (page - 1) * limit
        const slides = await Slide.find(query)
            .sort({ order: 1, createdAt: -1 }) // Sort by order first, then by creation date
            .skip(skip)
            .limit(limit)

        const total = await Slide.countDocuments(query)

        return NextResponse.json({
            slides,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        })
    } catch (error: any) {
        console.error("Get slides error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to fetch slides" },
            { status: 500 }
        )
    }
}

// POST - Create new slide
export async function POST(request: NextRequest) {
    try {
        const user = await authenticate(request)
        await connectDB()

        const formData = await request.formData()
        const title = (formData.get("title") as string)?.trim()
        const description = (formData.get("description") as string)?.trim()
        const content = (formData.get("content") as string)?.trim()
        const slug = (formData.get("slug") as string)?.trim()
        const isActiveRaw = formData.get("isActive")
        const isActive = isActiveRaw ? isActiveRaw === "true" : true
        const orderRaw = formData.get("order") as string | null
        const buttonsRaw = formData.get("buttons") as string | null

        // Validation
        if (!title || !description || !content) {
            return NextResponse.json(
                { error: "Title, description, and content are required" },
                { status: 400 }
            )
        }

        if (!slug) {
            return NextResponse.json(
                { error: "Slug is required" },
                { status: 400 }
            )
        }

        // Check if slug already exists
        const existingSlide = await Slide.findOne({ slug })
        if (existingSlide) {
            return NextResponse.json(
                { error: "Slug already exists. Please use a unique slug." },
                { status: 400 }
            )
        }

        // Parse buttons array if provided
        let buttons = undefined
        if (buttonsRaw) {
            try {
                buttons = JSON.parse(buttonsRaw)
                // Validate buttons structure
                if (Array.isArray(buttons)) {
                    for (const button of buttons) {
                        if (!button.text || !button.link) {
                            return NextResponse.json(
                                { error: "Each button must have text and link" },
                                { status: 400 }
                            )
                        }
                    }
                }
            } catch (error) {
                return NextResponse.json(
                    { error: "Invalid buttons format. Must be valid JSON array" },
                    { status: 400 }
                )
            }
        }

        // Handle order field
        let order = 0
        if (orderRaw && orderRaw.trim() !== "") {
            order = Number.parseInt(orderRaw)
            if (isNaN(order)) {
                return NextResponse.json(
                    { error: "Order must be a number" },
                    { status: 400 }
                )
            }
        } else {
            // Get the highest order number and increment by 1
            const lastSlide = await Slide.findOne().sort({ order: -1 }).select("order")
            order = lastSlide ? (lastSlide.order || 0) + 1 : 1
        }

        // Handle thumbnail upload (required)
        const thumbnailFile = formData.get("thumbnail") as File | null
        if (!thumbnailFile || thumbnailFile.size === 0) {
            return NextResponse.json(
                { error: "Thumbnail image is required" },
                { status: 400 }
            )
        }

        const thumbnailBytes = await thumbnailFile.arrayBuffer()
        const thumbnailBuffer = Buffer.from(thumbnailBytes)

        if (!thumbnailFile.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "Thumbnail must be an image file" },
                { status: 400 }
            )
        }

        if (thumbnailFile.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: "Thumbnail size must be less than 5MB" },
                { status: 400 }
            )
        }

        const thumbnailUrl = await uploadToS3(
            thumbnailBuffer,
            thumbnailFile.name,
            thumbnailFile.type
        )

        // Handle video upload (optional)
        let videoUrl = undefined
        const videoFile = formData.get("video") as File | null
        if (videoFile && videoFile.size > 0) {
            const videoBytes = await videoFile.arrayBuffer()
            const videoBuffer = Buffer.from(videoBytes)

            if (!videoFile.type.startsWith("video/")) {
                return NextResponse.json(
                    { error: "Video file must be a valid video format" },
                    { status: 400 }
                )
            }

            if (videoFile.size > 50 * 1024 * 1024) {
                return NextResponse.json(
                    { error: "Video size must be less than 50MB" },
                    { status: 400 }
                )
            }

            videoUrl = await uploadToS3(videoBuffer, videoFile.name, videoFile.type)
        }

        const slideData: any = {
            title,
            description,
            content,
            thumbnail: thumbnailUrl,
            slug,
            isActive,
            order,
        }

        // Add optional fields if they exist
        if (videoUrl) {
            slideData.video = videoUrl
        }
        if (buttons && buttons.length > 0) {
            slideData.buttons = buttons
        }

        const newSlide = await Slide.create(slideData)

        return NextResponse.json(
            {
                message: "Slide created successfully",
                slide: newSlide,
            },
            { status: 201 }
        )
    } catch (error: any) {
        console.error("Create slide error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to create slide" },
            { status: error.message === "Authentication failed" ? 401 : 500 }
        )
    }
}