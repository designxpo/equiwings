import { type NextRequest, NextResponse } from "next/server"
import { authenticate } from "@/lib/middleware/auth"
import connectDB from "@/lib/db/connection"
import Seo from "@/lib/models/Seo"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const user = await authenticate(request)
        await connectDB()

        const seoData = await Seo.findById(id)

        if (!seoData) {
            return NextResponse.json(
                { success: false, error: "SEO data not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: seoData,
        })
    } catch (error: any) {
        console.error("Get SEO by ID error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Failed to fetch SEO data" },
            { status: error.message === "Authentication failed" ? 401 : 500 },
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const user = await authenticate(request)
        await connectDB()

        const body = await request.json()
        const { type, metaTitle, metaDescription, metaKeywords, isActive } = body

        if (!metaTitle || !metaDescription || !metaKeywords) {
            return NextResponse.json(
                { success: false, error: "Meta title, description, and keywords are required" },
                { status: 400 }
            )
        }

        const seoData = await Seo.findById(id)
        if (!seoData) {
            return NextResponse.json(
                { success: false, error: "SEO data not found" },
                { status: 404 }
            )
        }

        // Check if type is being changed and if it already exists
        if (type && type.toLowerCase() !== seoData.type) {
            const existingSEO = await Seo.findOne({
                type: type.toLowerCase(),
                _id: { $ne: id }
            })
            if (existingSEO) {
                return NextResponse.json(
                    { success: false, error: "SEO data for this page already exists" },
                    { status: 400 }
                )
            }
            seoData.type = type.toLowerCase()
        }

        seoData.metaTitle = metaTitle
        seoData.metaDescription = metaDescription
        seoData.metaKeywords = metaKeywords
        if (typeof isActive === "boolean") {
            seoData.isActive = isActive
        }

        await seoData.save()

        return NextResponse.json({
            success: true,
            message: "SEO data updated successfully",
            data: seoData,
        })
    } catch (error: any) {
        console.error("Update SEO data error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Failed to update SEO data" },
            { status: error.message === "Authentication failed" ? 401 : 500 },
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const user = await authenticate(request)
        await connectDB()

        const seoData = await Seo.findByIdAndDelete(id)

        if (!seoData) {
            return NextResponse.json(
                { success: false, error: "SEO data not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: "SEO data deleted successfully",
        })
    } catch (error: any) {
        console.error("Delete SEO data error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Failed to delete SEO data" },
            { status: error.message === "Authentication failed" ? 401 : 500 },
        )
    }
}