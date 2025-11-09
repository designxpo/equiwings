// api/admin/events/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Event from "@/lib/models/Event"
import { authenticate } from "@/lib/middleware/auth"
import { uploadToS3, deleteFromS3 } from "@/lib/utils/s3"

// GET - Fetch event by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await authenticate(request)
        await connectDB()
        const { id } = await params

        const event = await Event.findById(id)
        if (!event) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                message: "Event retrieved successfully",
                event,
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error("Get event error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to retrieve event" },
            { status: error.message === "Authentication failed" ? 401 : 500 }
        )
    }
}

// PUT - Update event by ID
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await authenticate(request)
        await connectDB()

        const { id } = await params
        const existingEvent = await Event.findById(id)

        if (!existingEvent) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            )
        }

        const formData = await request.formData()
        const title = (formData.get("title") as string)?.trim()
        const description = (formData.get("description") as string)?.trim()
        const content = (formData.get("content") as string)?.trim()
        const slug = (formData.get("slug") as string)?.trim()
        const date = (formData.get("date") as string)?.trim()
        const location = (formData.get("location") as string)?.trim()
        const isActive = formData.get("isActive") === "true"
        const isPastEvent = formData.get("isPastEvent") === "true"
        const orderRaw = formData.get("order") as string | null

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

        // Check if slug already exists for a different event
        const slugExists = await Event.findOne({
            slug,
            _id: { $ne: id }
        })
        if (slugExists) {
            return NextResponse.json(
                { error: "Slug already exists. Please use a unique slug." },
                { status: 400 }
            )
        }

        // Handle order field
        let order = existingEvent.order // Default to existing order
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
            isPastEvent,
            order,
        }

        // Add optional text fields
        if (date) updateData.date = date
        if (location) updateData.location = location

        // Handle banner image update
        const bannerFile = formData.get("bannerImage") as File | null
        const currentBanner = formData.get("currentBannerImage") as string | null
        const removeBanner = formData.get("removeBannerImage") === "true"

        if (removeBanner) {
            if (existingEvent.bannerImage) {
                try {
                    await deleteFromS3(existingEvent.bannerImage)
                } catch (error) {
                    console.error("Error deleting banner:", error)
                }
            }
            updateData.bannerImage = undefined
        } else if (bannerFile && bannerFile.size > 0) {
            const bytes = await bannerFile.arrayBuffer()
            const buffer = Buffer.from(bytes)

            if (!bannerFile.type.startsWith("image/")) {
                return NextResponse.json(
                    { error: "Banner image must be an image file" },
                    { status: 400 }
                )
            }

            if (bannerFile.size > 5 * 1024 * 1024) {
                return NextResponse.json(
                    { error: "Banner image size must be less than 5MB" },
                    { status: 400 }
                )
            }

            if (existingEvent.bannerImage) {
                try {
                    await deleteFromS3(existingEvent.bannerImage)
                } catch (error) {
                    console.error("Error deleting old banner:", error)
                }
            }

            updateData.bannerImage = await uploadToS3(buffer, bannerFile.name, bannerFile.type)
        } else if (currentBanner) {
            updateData.bannerImage = currentBanner
        }

        // Handle event images update (multiple files)
        const eventImagesFiles = formData.getAll("eventImages") as File[]
        const currentEventImages = formData.get("currentEventImages") as string | null
        const removeEventImages = formData.get("removeEventImages") === "true"

        if (removeEventImages) {
            // Delete all existing event images
            if (existingEvent.eventImages && existingEvent.eventImages.length > 0) {
                for (const imageUrl of existingEvent.eventImages) {
                    try {
                        await deleteFromS3(imageUrl)
                    } catch (error) {
                        console.error("Error deleting event image:", error)
                    }
                }
            }
            updateData.eventImages = undefined
        } else if (eventImagesFiles && eventImagesFiles.length > 0 && eventImagesFiles[0].size > 0) {
            // New images uploaded - delete old ones first
            if (existingEvent.eventImages && existingEvent.eventImages.length > 0) {
                for (const imageUrl of existingEvent.eventImages) {
                    try {
                        await deleteFromS3(imageUrl)
                    } catch (error) {
                        console.error("Error deleting old event image:", error)
                    }
                }
            }

            // Upload new images
            const eventImagesUrls: string[] = []
            for (const file of eventImagesFiles) {
                if (file && file.size > 0) {
                    const bytes = await file.arrayBuffer()
                    const buffer = Buffer.from(bytes)

                    if (!file.type.startsWith("image/")) {
                        return NextResponse.json(
                            { error: "All event images must be image files" },
                            { status: 400 }
                        )
                    }

                    if (file.size > 5 * 1024 * 1024) {
                        return NextResponse.json(
                            { error: "Each event image must be less than 5MB" },
                            { status: 400 }
                        )
                    }

                    const url = await uploadToS3(buffer, file.name, file.type)
                    eventImagesUrls.push(url)
                }
            }
            updateData.eventImages = eventImagesUrls.length > 0 ? eventImagesUrls : undefined
        } else if (currentEventImages) {
            // Keep current event images
            try {
                updateData.eventImages = JSON.parse(currentEventImages)
            } catch (error) {
                updateData.eventImages = existingEvent.eventImages
            }
        }

        const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        })

        return NextResponse.json({
            message: "Event updated successfully",
            event: updatedEvent,
        })
    } catch (error: any) {
        console.error("Update event error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to update event" },
            { status: error.message === "Authentication failed" ? 401 : 500 }
        )
    }
}

// DELETE - Delete event by ID
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await authenticate(request)
        await connectDB()

        const { id } = await params
        const existingEvent = await Event.findById(id)

        if (!existingEvent) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            )
        }

        // Delete associated files from S3
        try {
            if (existingEvent.bannerImage) {
                await deleteFromS3(existingEvent.bannerImage)
            }
            if (existingEvent.eventImages && existingEvent.eventImages.length > 0) {
                for (const imageUrl of existingEvent.eventImages) {
                    await deleteFromS3(imageUrl)
                }
            }
        } catch (error) {
            console.error("Error deleting files from S3:", error)
            // Continue with deletion even if S3 deletion fails
        }

        await Event.findByIdAndDelete(id)

        return NextResponse.json({
            message: "Event deleted successfully",
        })
    } catch (error: any) {
        console.error("Delete event error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to delete event" },
            { status: error.message === "Authentication failed" ? 401 : 500 }
        )
    }
}