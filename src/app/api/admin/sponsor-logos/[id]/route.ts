import { type NextRequest, NextResponse } from "next/server"
import { authenticate } from "@/lib/middleware/auth"
import connectDB from "@/lib/db/connection"
import SponsorLogo from "@/lib/models/SponsorLogo"
import { uploadToS3, deleteFromS3 } from "@/lib/utils/s3"

interface Params {
    params: Promise<{ id: string }>
}

// GET sponsor logo by ID
export async function GET(request: NextRequest, { params }: Params) {
    try {
        const user = await authenticate(request)
        await connectDB()

        const { id } = await params
        const sponsorLogo = await SponsorLogo.findById(id)

        if (!sponsorLogo) {
            return NextResponse.json(
                { success: false, error: "Sponsor logo not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: sponsorLogo,
        })
    } catch (error: any) {
        console.error("Get sponsor logo error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Failed to fetch sponsor logo" },
            { status: error.message === "Authentication failed" ? 401 : 500 }
        )
    }
}

// UPDATE sponsor logo
export async function PUT(request: NextRequest, { params }: Params) {
    try {
        const user = await authenticate(request)
        await connectDB()
        const { id } = await params

        const existingLogo = await SponsorLogo.findById(id)
        if (!existingLogo) {
            return NextResponse.json({ error: "Sponsor logo not found" }, { status: 404 })
        }

        const formData = await request.formData()
        const name = formData.get("name") as string
        const website = formData.get("website") as string
        const description = formData.get("description") as string
        const type = formData.get("type") as string
        const status = formData.get("status") as string
        const order = formData.get("order") ? Number(formData.get("order")) : undefined
        const imageFile = formData.get("logo") as File | null

        const updateData: any = {}
        if (name !== undefined) updateData.name = name
        if (website !== undefined) updateData.website = website
        if (description !== undefined) updateData.description = description
        if (type !== undefined) updateData.type = type
        if (status !== undefined) updateData.status = status
        if (order !== undefined) updateData.order = order

        // Handle image upload / replace
        if (imageFile && imageFile.size > 0) {
            if (!imageFile.type.startsWith("image/")) {
                return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
            }

            if (imageFile.size > 5 * 1024 * 1024) {
                return NextResponse.json({ error: "Image size must be less than 5MB" }, { status: 400 })
            }

            // Delete old logo if exists
            if (existingLogo.logo_url) {
                try {
                    await deleteFromS3(existingLogo.logo_url)
                } catch (error) {
                    console.error("Error deleting old logo from S3:", error)
                }
            }

            // Upload new logo
            const bytes = await imageFile.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const logoUrl = await uploadToS3(buffer, imageFile.name, imageFile.type)
            updateData.logo_url = logoUrl
        }

        const updatedLogo = await SponsorLogo.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

        return NextResponse.json(
            {
                success: true,
                message: "Sponsor logo updated successfully",
                data: updatedLogo,
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error("Update sponsor logo error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to update sponsor logo" },
            { status: error.message === "Authentication failed" ? 401 : 500 }
        )
    }
}

// DELETE sponsor logo
export async function DELETE(request: NextRequest, { params }: Params) {
    try {
        const user = await authenticate(request)
        await connectDB()
        const { id } = await params

        const existingLogo = await SponsorLogo.findById(id)
        if (!existingLogo) {
            return NextResponse.json({ error: "Sponsor logo not found" }, { status: 404 })
        }

        // Delete image from S3 if exists
        if (existingLogo.logo_url) {
            try {
                await deleteFromS3(existingLogo.logo_url)
            } catch (error) {
                console.error("Error deleting logo from S3:", error)
            }
        }

        await SponsorLogo.findByIdAndDelete(id)

        return NextResponse.json({ message: "Sponsor logo deleted successfully" }, { status: 200 })
    } catch (error: any) {
        console.error("Delete sponsor logo error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to delete sponsor logo" },
            { status: error.message === "Authentication failed" ? 401 : 500 }
        )
    }
}
