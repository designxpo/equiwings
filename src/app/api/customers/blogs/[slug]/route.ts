import Blog from "@/lib/models/Blog"
import connectDB from "@/lib/db/connection"
import { NextRequest, NextResponse } from "next/server"
import { authenticate, authorize } from "@/lib/middleware/auth"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB()

        const { slug } = await params

        if (!slug) {
            return NextResponse.json(
                { error: "Blog slug is required" },
                { status: 400 }
            )
        }

        const blog = await Blog.findOne({ slug })
            .populate("author", "firstName lastName email")

        if (!blog) {
            return NextResponse.json(
                { error: "Blog not found" },
                { status: 404 }
            )
        }

        // Check if blog is published (for public access) or user has access
        if (blog.status !== "published") {
            try {
                const user = await authenticate(request)
                // Check if user is the author or has appropriate permissions
                if (blog.author._id.toString() !== user._id.toString()) {
                    await authorize(user, "BLOG", "READ")
                }
            } catch (error) {
                return NextResponse.json(
                    { error: "Blog not found" },
                    { status: 404 }
                )
            }
        }

        return NextResponse.json({ blog })
    } catch (error: any) {
        console.error("Get blog by slug error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to fetch blog" },
            { status: 500 }
        )
    }
}