// api/admin/slides/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Slide from "@/lib/models/Slide"
import { authenticate } from "@/lib/middleware/auth"
import { uploadToS3, deleteFromS3 } from "@/lib/utils/s3"

// GET - Fetch slide by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await authenticate(request)
        await connectDB()
        const { id } = await params

        const slide = await Slide.findById(id)
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

// PUT - Update slide by ID
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await authenticate(request)
        await connectDB()

        const { id } = await params
        const existingSlide = await Slide.findById(id)

        if (!existingSlide) {
            return NextResponse.json(
                { error: "Slide not found" },
                { status: 404 }
            )
        }

        const formData = await request.formData()
        const title = (formData.get("title") as string)?.trim()
        const description = (formData.get("description") as string)?.trim()
        const content = (formData.get("content") as string)?.trim()
        const slug = (formData.get("slug") as string)?.trim()
        const isActive = formData.get("isActive") === "true"
        const orderRaw = formData.get("order") as string | null
        const buttonsRaw = formData.get("buttons") as string | null

        // Validation
        if (!title || !description || !content) {
            return NextResponse.json(
                { error: "Title, description, and content are required" },
                { status: 400 }
            )
        }

        if (!slug) {
            return NextResponse.json(
                { error: "Slug is required" },
                { status: 400 }
            )
        }

        // Check if slug already exists for a different slide
        const slugExists = await Slide.findOne({
            slug,
            _id: { $ne: id }
        })
        if (slugExists) {
            return NextResponse.json(
                { error: "Slug already exists. Please use a unique slug." },
                { status: 400 }
            )
        }

        // Parse buttons array if provided
        let buttons = undefined
        if (buttonsRaw) {
            try {
                buttons = JSON.parse(buttonsRaw)
                // Validate buttons structure
                if (Array.isArray(buttons)) {
                    for (const button of buttons) {
                        if (!button.text || !button.link) {
                            return NextResponse.json(
                                { error: "Each button must have text and link" },
                                { status: 400 }
                            )
                        }
                    }
                }
            } catch (error) {
                return NextResponse.json(
                    { error: "Invalid buttons format. Must be valid JSON array" },
                    { status: 400 }
                )
            }
        }

        // Handle order field
        let order = existingSlide.order // Default to existing order
        if (orderRaw !== null && orderRaw.trim() !== "") {
            order = Number.parseInt(orderRaw)
            if (isNaN(order)) {
                return NextResponse.json(
                    { error: "Order must be a number" },
                    { status: 400 }
                )
            }
        }

        const updateData: any = {
            title,
            description,
            content,
            slug,
            isActive,
            order,
        }

        // Add buttons if provided
        if (buttons !== undefined) {
            updateData.buttons = buttons.length > 0 ? buttons : undefined
        }

        // Handle thumbnail update
        const thumbnailFile = formData.get("thumbnail") as File | null
        const currentThumbnail = formData.get("currentThumbnail") as string | null

        if (thumbnailFile && thumbnailFile.size > 0) {
            // New thumbnail uploaded
            const bytes = await thumbnailFile.arrayBuffer()
            const buffer = Buffer.from(bytes)

            // Validate file type
            if (!thumbnailFile.type.startsWith("image/")) {
                return NextResponse.json(
                    { error: "Thumbnail must be an image file" },
                    { status: 400 }
                )
            }

            // Validate file size (5MB limit)
            if (thumbnailFile.size > 5 * 1024 * 1024) {
                return NextResponse.json(
                    { error: "Thumbnail size must be less than 5MB" },
                    { status: 400 }
                )
            }

            // Delete old thumbnail if exists
            if (existingSlide.thumbnail) {
                try {
                    await deleteFromS3(existingSlide.thumbnail)
                } catch (error) {
                    console.error("Error deleting old thumbnail:", error)
                }
            }

            updateData.thumbnail = await uploadToS3(
                buffer,
                thumbnailFile.name,
                thumbnailFile.type
            )
        } else if (currentThumbnail) {
            // Keep current thumbnail
            updateData.thumbnail = currentThumbnail
        } else {
            // Thumbnail is required
            return NextResponse.json(
                { error: "Thumbnail is required" },
                { status: 400 }
            )
        }

        // Handle video update (optional)
        const videoFile = formData.get("video") as File | null
        const currentVideo = formData.get("currentVideo") as string | null
        const removeVideo = formData.get("removeVideo") === "true"

        if (removeVideo) {
            // User wants to remove the video
            if (existingSlide.video) {
                try {
                    await deleteFromS3(existingSlide.video)
                } catch (error) {
                    console.error("Error deleting video:", error)
                }
            }
            updateData.video = undefined
        } else if (videoFile && videoFile.size > 0) {
            // New video uploaded
            const bytes = await videoFile.arrayBuffer()
            const buffer = Buffer.from(bytes)

            // Validate file type
            if (!videoFile.type.startsWith("video/")) {
                return NextResponse.json(
                    { error: "Video file must be a valid video format" },
                    { status: 400 }
                )
            }

            // Validate file size (50MB limit)
            if (videoFile.size > 50 * 1024 * 1024) {
                return NextResponse.json(
                    { error: "Video size must be less than 50MB" },
                    { status: 400 }
                )
            }

            // Delete old video if exists
            if (existingSlide.video) {
                try {
                    await deleteFromS3(existingSlide.video)
                } catch (error) {
                    console.error("Error deleting old video:", error)
                }
            }

            updateData.video = await uploadToS3(buffer, videoFile.name, videoFile.type)
        } else if (currentVideo) {
            // Keep current video
            updateData.video = currentVideo
        }

        const updatedSlide = await Slide.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        })

        return NextResponse.json({
            message: "Slide updated successfully",
            slide: updatedSlide,
        })
    } catch (error: any) {
        console.error("Update slide error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to update slide" },
            { status: error.message === "Authentication failed" ? 401 : 500 }
        )
    }
}

// DELETE - Delete slide by ID
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await authenticate(request)
        await connectDB()

        const { id } = await params
        const existingSlide = await Slide.findById(id)

        if (!existingSlide) {
            return NextResponse.json(
                { error: "Slide not found" },
                { status: 404 }
            )
        }

        // Delete associated files from S3
        try {
            if (existingSlide.thumbnail) {
                await deleteFromS3(existingSlide.thumbnail)
            }
            if (existingSlide.video) {
                await deleteFromS3(existingSlide.video)
            }
        } catch (error) {
            console.error("Error deleting files from S3:", error)
            // Continue with deletion even if S3 deletion fails
        }

        await Slide.findByIdAndDelete(id)

        return NextResponse.json({
            message: "Slide deleted successfully",
        })
    } catch (error: any) {
        console.error("Delete slide error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to delete slide" },
            { status: error.message === "Authentication failed" ? 401 : 500 }
        )
    }
}