import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import SponsorLogo from "@/lib/models/SponsorLogo"

export async function GET(request: NextRequest) {
    try {
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
