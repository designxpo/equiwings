// api/admin/events/route.ts
import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Event from "@/lib/models/Event"
import { authenticate } from "@/lib/middleware/auth"
import { uploadToS3 } from "@/lib/utils/s3"

// GET - Fetch all events
export async function GET(request: NextRequest) {
    try {
        await connectDB()
        const { searchParams } = new URL(request.url)
        const page = Number.parseInt(searchParams.get("page") || "1")
        const limit = Number.parseInt(searchParams.get("limit") || "10")
        const search = searchParams.get("search") || ""
        const isActive = searchParams.get("isActive")
        const isPastEvent = searchParams.get("isPastEvent")

        const query: any = {}

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
            ]
        }

        if (isActive !== null) {
            query.isActive = isActive === "true"
        }

        if (isPastEvent !== null) {
            query.isPastEvent = isPastEvent === "true"
        }

        const skip = (page - 1) * limit
        const events = await Event.find(query)
            .sort({ isPastEvent: 1, order: 1, createdAt: -1 }) // Sort: upcoming first, then by order, then by date
            .skip(skip)
            .limit(limit)

        const total = await Event.countDocuments(query)

        return NextResponse.json({
            events,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        })
    } catch (error: any) {
        console.error("Get events error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to fetch events" },
            { status: 500 }
        )
    }
}

// POST - Create new event
export async function POST(request: NextRequest) {
    try {
        const user = await authenticate(request)
        await connectDB()

        const formData = await request.formData()
        const title = (formData.get("title") as string)?.trim()
        const description = (formData.get("description") as string)?.trim()
        const content = (formData.get("content") as string)?.trim()
        const slug = (formData.get("slug") as string)?.trim()
        const date = (formData.get("date") as string)?.trim()
        const location = (formData.get("location") as string)?.trim()
        const isActiveRaw = formData.get("isActive")
        const isActive = isActiveRaw ? isActiveRaw === "true" : true
        const isPastEventRaw = formData.get("isPastEvent")
        const isPastEvent = isPastEventRaw ? isPastEventRaw === "true" : false
        const orderRaw = formData.get("order") as string | null

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
        const existingEvent = await Event.findOne({ slug })
        if (existingEvent) {
            return NextResponse.json(
                { error: "Slug already exists. Please use a unique slug." },
                { status: 400 }
            )
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
            const lastEvent = await Event.findOne({ isPastEvent })
                .sort({ order: -1 })
                .select("order")
            order = lastEvent ? (lastEvent.order || 0) + 1 : 1
        }

        // Handle banner image upload (optional)
        let bannerImageUrl = undefined
        const bannerFile = formData.get("bannerImage") as File | null
        if (bannerFile && bannerFile.size > 0) {
            const bannerBytes = await bannerFile.arrayBuffer()
            const bannerBuffer = Buffer.from(bannerBytes)

            if (!bannerFile.type.startsWith("image/")) {
                return NextResponse.json(
                    { error: "Banner image must be an image file" },
                    { status: 400 }
                )
            }

            if (bannerFile.size > 5 * 1024 * 1024) {
                return NextResponse.json(
                    { error: "Banner image size must be less than 5MB" },
                    { status: 400 }
                )
            }

            bannerImageUrl = await uploadToS3(
                bannerBuffer,
                bannerFile.name,
                bannerFile.type
            )
        }

        // Handle event images upload (multiple files, optional)
        let eventImagesUrls: string[] = []
        const eventImagesFiles = formData.getAll("eventImages") as File[]
        if (eventImagesFiles && eventImagesFiles.length > 0) {
            for (const file of eventImagesFiles) {
                if (file && file.size > 0) {
                    const bytes = await file.arrayBuffer()
                    const buffer = Buffer.from(bytes)

                    if (!file.type.startsWith("image/")) {
                        return NextResponse.json(
                            { error: "All event images must be image files" },
                            { status: 400 }
                        )
                    }

                    if (file.size > 5 * 1024 * 1024) {
                        return NextResponse.json(
                            { error: "Each event image must be less than 5MB" },
                            { status: 400 }
                        )
                    }

                    const url = await uploadToS3(buffer, file.name, file.type)
                    eventImagesUrls.push(url)
                }
            }
        }

        const eventData: any = {
            title,
            description,
            content,
            slug,
            isActive,
            isPastEvent,
            order,
        }

        // Add optional fields if they exist
        if (bannerImageUrl) eventData.bannerImage = bannerImageUrl
        if (date) eventData.date = date
        if (location) eventData.location = location
        if (eventImagesUrls.length > 0) eventData.eventImages = eventImagesUrls

        const newEvent = await Event.create(eventData)

        return NextResponse.json(
            {
                message: "Event created successfully",
                event: newEvent,
            },
            { status: 201 }
        )
    } catch (error: any) {
        console.error("Create event error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to create event" },
            { status: error.message === "Authentication failed" ? 401 : 500 }
        )
    }
}