import connectDB from "@/lib/db/connection"
import Blog from "@/lib/models/Blog"
import { NextRequest, NextResponse } from "next/server"



export async function GET(request: NextRequest) {
    try {
        await connectDB()

        const { searchParams } = new URL(request.url)
        const page = Number.parseInt(searchParams.get("page") || "1")
        const limit = Number.parseInt(searchParams.get("limit") || "10")
        const search = searchParams.get("search")
        const category = searchParams.get("category")
        const status = searchParams.get("status")
        const author = searchParams.get("author")
        const sortBy = searchParams.get("sortBy") || "createdAt"
        const sortOrder = searchParams.get("sortOrder") || "desc"

        // Build query object
        const query: any = {}

        // Add status filter (default to published for public access)
        if (status) {
            query.status = status
        } else {
            query.status = "published"
        }

        // Add search functionality
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
            ]
        }

        // Add category filter
        if (category) {
            query.category = category
        }

        // Add author filter
        if (author) {
            query.author = author
        }

        // Build sort object
        const sort: any = {}
        sort[sortBy] = sortOrder === "desc" ? -1 : 1

        // Execute query with pagination
        const skip = (page - 1) * limit
        const blogs = await Blog.find(query)
            .populate("author", "firstName lastName email")
            .select("-content") // Exclude content for list view
            .sort(sort)
            .skip(skip)
            .limit(limit)

        const total = await Blog.countDocuments(query)

        return NextResponse.json({
            blogs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        })
    } catch (error: any) {
        console.error("Get blogs error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to fetch blogs" },
            { status: 500 }
        )
    }
}