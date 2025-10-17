import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Blog from "@/lib/models/Blog"
import { authenticate, authorize } from "@/lib/middleware/auth"
import { deleteFromS3, uploadToS3 } from "@/lib/utils/s3"

// GET /api/blogs/[id] - Get blog by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 })
    }

    const blog = await Blog.findById(id).populate("author", "firstName lastName email")

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
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
        return NextResponse.json({ error: "Blog not found" }, { status: 404 })
      }
    }

    return NextResponse.json({ blog })
  } catch (error: any) {
    console.error("Get blog by ID error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch blog" }, { status: 500 })
  }
}

// PUT /api/blogs/[id] - Update blog by ID
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticate(request)
    await connectDB()
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 })
    }

    const formData = await request.formData()

    // Extract form fields
    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const content = formData.get("content") as string
    const category = formData.get("category") as string
    const status = formData.get("status") as string

    // Extract SEO fields
    const metaTitle = formData.get("metaTitle") as string
    const metaDescription = formData.get("metaDescription") as string
    const metaKeywords = formData.get("metaKeywords") as string

    // Find existing blog
    const existingBlog = await Blog.findById(id)
    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Check if user is the author or has appropriate permissions
    if (existingBlog.author.toString() !== user._id.toString()) {
      await authorize(user, "BLOG", "UPDATE")
    }

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
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

    // Check if slug already exists (excluding current blog)
    const existingSlug = await Blog.findOne({
      slug: finalSlug,
      _id: { $ne: id },
    })
    if (existingSlug) {
      return NextResponse.json({ error: "Blog with this slug already exists" }, { status: 400 })
    }

    // Handle featured image upload and deletion
    let featuredImageUrl = existingBlog.featuredImage // Keep existing image by default
    const featuredImageFile = formData.get("featuredImage") as File

    if (featuredImageFile && featuredImageFile.size > 0) {
      try {
        // Upload new image
        const imageBuffer = Buffer.from(await featuredImageFile.arrayBuffer())
        featuredImageUrl = await uploadToS3(imageBuffer, featuredImageFile.name, featuredImageFile.type)

        // Delete old image if it exists and upload was successful
        if (existingBlog.featuredImage) {
          try {
            await deleteFromS3(existingBlog.featuredImage)
          } catch (deleteError) {
            console.error("Failed to delete old image:", deleteError)
            // Continue with update even if deletion fails
          }
        }
      } catch (uploadError) {
        console.error("File upload error:", uploadError)
        return NextResponse.json({ error: "Failed to upload featured image" }, { status: 500 })
      }
    }

    // Prepare update data
    const updateData: any = {
      title,
      slug: finalSlug,
      content,
      featuredImage: featuredImageUrl,
      category,
      status: status || existingBlog.status,
      // SEO fields
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      metaKeywords: metaKeywords || null,
    }

    // Update publishedAt if status changes to published
    if (status === "published" && existingBlog.status !== "published") {
      updateData.publishedAt = new Date()
    } else if (status !== "published") {
      updateData.publishedAt = null
    }

    // Update blog
    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate(
      "author",
      "firstName lastName email",
    )

    return NextResponse.json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    })
  } catch (error: any) {
    console.error("Update blog error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update blog" },
      { status: error.message === "Authentication failed" ? 401 : 500 },
    )
  }
}

// DELETE /api/blogs/[id] - Delete blog by ID
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticate(request)
    await connectDB()
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Blog ID is required" }, { status: 400 })
    }

    // Find existing blog
    const existingBlog = await Blog.findById(id)
    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Check if user is the author or has appropriate permissions
    if (existingBlog.author.toString() !== user._id.toString()) {
      await authorize(user, "BLOG", "DELETE")
    }

    // Delete associated image from S3 if it exists
    if (existingBlog.featuredImage) {
      try {
        await deleteFromS3(existingBlog.featuredImage)
      } catch (deleteError) {
        console.error("Failed to delete image from S3:", deleteError)
        // Continue with blog deletion even if image deletion fails
      }
    }

    // Delete blog
    await Blog.findByIdAndDelete(id)

    return NextResponse.json({
      message: "Blog deleted successfully",
    })
  } catch (error: any) {
    console.error("Delete blog error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete blog" },
      { status: error.message === "Authentication failed" ? 401 : 500 },
    )
  }
}
