import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Blog from "@/lib/models/Blog"
import { authenticate, authorize } from "@/lib/middleware/auth"
import { uploadToS3 } from "@/lib/utils/s3"

// GET /api/blogs - Get all blogs with pagination and filtering
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
        return NextResponse.json(
            { error: error.message || "Failed to fetch blogs" },
            { status: 500 }
        )
    }
}

// POST /api/blogs - Create new blog
export async function POST(request: NextRequest) {
    try {
        const user = await authenticate(request)
        // await authorize(user, "BLOG", "CREATE")
        await connectDB()

        const formData = await request.formData()

        // Extract form fields
        const title = formData.get("title") as string
        const slug = formData.get("slug") as string
        const content = formData.get("content") as string
        const category = formData.get("category") as string
        const status = formData.get("status") as string

        // Extract meta fields
        const metaTitle = formData.get("metaTitle") as string
        const metaDescription = formData.get("metaDescription") as string
        const metaKeywords = formData.get("metaKeywords") as string

        // Validate required fields
        if (!title || !content) {
            return NextResponse.json(
                { error: "Title and content are required" },
                { status: 400 }
            )
        }

        // Generate slug from title if not provided
        let finalSlug = slug
        if (!finalSlug) {
            finalSlug = title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-")
                .trim()
        }

        // Check if slug already exists
        const existingBlog = await Blog.findOne({ slug: finalSlug })
        if (existingBlog) {
            return NextResponse.json(
                { error: "Blog with this slug already exists" },
                { status: 400 }
            )
        }

        // Handle featured image upload
        let featuredImageUrl = null
        const featuredImageFile = formData.get("featuredImage") as File

        if (featuredImageFile && featuredImageFile.size > 0) {
            try {
                const imageBuffer = Buffer.from(await featuredImageFile.arrayBuffer())
                featuredImageUrl = await uploadToS3(imageBuffer, featuredImageFile.name, featuredImageFile.type)
            } catch (uploadError) {
                return NextResponse.json(
                    { error: "Failed to upload featured image" },
                    { status: 500 }
                )
            }
        }

        // Create blog with meta fields
        const newBlog = await Blog.create({
            title,
            slug: finalSlug,
            content,
            featuredImage: featuredImageUrl,
            author: user._id,
            category,
            status: status || "draft",
            publishedAt: status === "published" ? new Date() : null,
            // Add meta fields
            metaTitle: metaTitle || title, // Use title as fallback if metaTitle is empty
            metaDescription: metaDescription || null,
            metaKeywords: metaKeywords || null,
        })

        // Return blog with author populated
        const blogResponse = await Blog.findById(newBlog._id)
            .populate("author", "firstName lastName email")

        return NextResponse.json(
            {
                message: "Blog created successfully",
                blog: blogResponse,
            },
            { status: 201 }
        )
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to create blog" },
            { status: error.message === "Authentication failed" ? 401 : 500 }
        )
    }
}
