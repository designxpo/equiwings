import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Slide from "@/lib/models/Slide"
import { authenticate } from "@/lib/middleware/auth"

// GET - Fetch slide by slug
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const user = await authenticate(request)
        await connectDB()
        const { slug } = await params

        const slide = await Slide.findOne({ slug })
        if (!slide) {
            return NextResponse.json(
                { error: "Slide not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                message: "Slide retrieved successfully",
                slide,
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error("Get slide error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to retrieve slide" },
            { status: error.message === "Authentication failed" ? 401 : 500 }
        )
    }
}
