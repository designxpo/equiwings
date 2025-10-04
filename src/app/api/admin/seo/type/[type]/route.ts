import { type NextRequest, NextResponse } from "next/server"
import { authenticate } from "@/lib/middleware/auth"
import connectDB from "@/lib/db/connection"
import Seo from "@/lib/models/Seo"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ type: string }> }
) {
    const { type } = await params;
    try {
        const user = await authenticate(request)
        await connectDB()

        const seoData = await Seo.findOne({ type: type.toLowerCase() })

        if (!seoData) {
            return NextResponse.json(
                { success: false, error: "SEO data not found for this page" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: seoData,
        })
    } catch (error: any) {
        console.error("Get SEO by type error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Failed to fetch SEO data" },
            { status: error.message === "Authentication failed" ? 401 : 500 },
        )
    }
}
