// api/admin/gallery/route.ts
import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Gallery from "@/lib/models/Gallery"
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
        const category = searchParams.get("category")

        const query: any = {}
        if (search) {
            query.title = { $regex: search, $options: "i" }
        }

        if (isActive !== null) {
            query.isActive = isActive === "true"
        }

        if (category) {
            query.category = category
        }

        const skip = (page - 1) * limit
        const galleryList = await Gallery.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const total = await Gallery.countDocuments(query)

        return NextResponse.json({
            gallery: galleryList,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        })
    } catch (error: any) {
        console.error("Get gallery error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to fetch gallery" },
            { status: 500 },
        )
    }
}

// api/admin/gallery/route.ts - POST function
export async function POST(request: NextRequest) {
    try {
        const user = await authenticate(request)
        await connectDB()

        const formData = await request.formData()
        const title = (formData.get("title") as string)?.trim()
        const category = (formData.get("category") as string)?.trim()
        const isActiveRaw = formData.get("isActive")
        const isActive = isActiveRaw ? isActiveRaw === "true" : true
        const orderRaw = formData.get("order") as string | null

        // Validation
        if (!title || !category) {
            return NextResponse.json(
                { error: "Title and category are required" },
                { status: 400 },
            )
        }

        if (!["sports", "events", "facilities", "achievements", "training", "other"].includes(category)) {
            return NextResponse.json({ error: "Invalid category" }, { status: 400 })
        }

        // Handle order field - if not provided, get the next order number
        let order = 0
        if (orderRaw && orderRaw.trim() !== "") {
            order = Number.parseInt(orderRaw)
            if (isNaN(order)) {
                return NextResponse.json({ error: "Order must be a number" }, { status: 400 })
            }
        } else {
            // Get the highest order number and increment by 1
            const lastGalleryItem = await Gallery.findOne().sort({ order: -1 }).select("order")
            order = lastGalleryItem ? lastGalleryItem.order + 1 : 1
        }

        // Handle image upload (required)
        const imageFile = formData.get("image") as File | null
        if (!imageFile || imageFile.size === 0) {
            return NextResponse.json({ error: "Image is required" }, { status: 400 })
        }

        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)

        if (!imageFile.type.startsWith("image/")) {
            return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
        }

        if (imageFile.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "Image size must be less than 5MB" }, { status: 400 })
        }

        const imageUrl = await uploadToS3(imageFile)

        const galleryData = {
            title,
            image: imageUrl,
            category,
            isActive,
            order, // Add order field
        }

        const newEntry = await Gallery.create(galleryData)

        return NextResponse.json(
            {
                message: "Gallery item created successfully",
                gallery: newEntry,
            },
            { status: 201 },
        )
    } catch (error: any) {
        console.error("Create gallery error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to create gallery item" },
            { status: error.message === "Authentication failed" ? 401 : 500 },
        )
    }
}