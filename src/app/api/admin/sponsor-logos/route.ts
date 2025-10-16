import { type NextRequest, NextResponse } from "next/server"
import { authenticate } from "@/lib/middleware/auth"
import connectDB from "@/lib/db/connection"
import SponsorLogo from "@/lib/models/SponsorLogo"
import { uploadToS3 } from "@/lib/utils/s3"

export async function GET(request: NextRequest) {
    try {
        const user = await authenticate(request)
        await connectDB()

        const { searchParams } = new URL(request.url)
        const page = Number.parseInt(searchParams.get("page") || "1")
        const limit = Number.parseInt(searchParams.get("limit") || "10")
        const search = searchParams.get("search")
        const type = searchParams.get("type")
        const status = searchParams.get("status")

        const query: any = {}

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { website: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { type: { $regex: search, $options: "i" } },
            ]
        }

        if (type) {
            query.type = type
        }

        if (status) {
            query.status = status
        }

        const skip = (page - 1) * limit
        const sponsorLogos = await SponsorLogo.find(query)
            .sort({ type: 1, order: 1, createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const total = await SponsorLogo.countDocuments(query)

        return NextResponse.json({
            success: true,
            data: sponsorLogos,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        })
    } catch (error: any) {
        console.error("Get sponsor logos error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Failed to fetch sponsor logos" },
            { status: error.message === "Authentication failed" ? 401 : 500 },
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await authenticate(request)
        await connectDB()

        const formData = await request.formData()
        const name = formData.get("name") as string
        const website = formData.get("website") as string
        const description = formData.get("description") as string
        const type = formData.get("type") as string || "partner"
        const status = formData.get("status") as string || "active"
        const order = Number.parseInt(formData.get("order") as string || "0")
        const imageFile = formData.get("logo_url") as File | null

        if (!imageFile || imageFile.size === 0) {
            return NextResponse.json(
                { success: false, error: "Logo image is required" },
                { status: 400 }
            )
        }

        let logo_url = ""

        // Upload image to S3 if provided
        if (imageFile && imageFile.size > 0) {

            // Validate file type
            if (!imageFile.type.startsWith("image/")) {
                return NextResponse.json(
                    { success: false, error: "Only image files are allowed" },
                    { status: 400 }
                )
            }

            // Validate file size (5MB limit)
            if (imageFile.size > 5 * 1024 * 1024) {
                return NextResponse.json(
                    { success: false, error: "Image size must be less than 5MB" },
                    { status: 400 }
                )
            }

            logo_url = await uploadToS3(imageFile)
        }

        // Check for duplicate order in the same type if active
        if (order !== undefined && status !== 'inactive') {
            const existingOrder = await SponsorLogo.findOne({
                type: type || 'partner',
                order,
                status: 'active'
            })
            if (existingOrder) {
                return NextResponse.json(
                    { success: false, error: "Another active sponsor already uses this order position for the same type" },
                    { status: 400 }
                )
            }
        }

        const newSponsorLogo = await SponsorLogo.create({
            name: name || '',
            logo_url,
            website: website || '',
            description: description || '',
            type: type || 'partner',
            status: status || 'active',
            order: order || 0,
        })

        return NextResponse.json(
            {
                success: true,
                message: "Sponsor logo created successfully",
                data: newSponsorLogo,
            },
            { status: 201 }
        )
    } catch (error: any) {
        console.error("Create sponsor logo error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Failed to create sponsor logo" },
            { status: error.message === "Authentication failed" ? 401 : 500 },
        )
    }
}