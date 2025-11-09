// api/admin/slides/route.ts
import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Slide from "@/lib/models/Slide"

// GET - Fetch only active slides (no pagination)
export async function GET(request: NextRequest) {
    try {
        await connectDB()

        // Always fetch only active slides
        const slides = await Slide.find({ isActive: true })
            .sort({ order: 1, createdAt: -1 }) // Sort by order first, then by creation date

        return NextResponse.json({ slides })
    } catch (error: any) {
        console.error("Get slides error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to fetch active slides" },
            { status: 500 }
        )
    }
}
