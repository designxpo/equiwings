import { type NextRequest, NextResponse } from "next/server"
import { authenticate } from "@/lib/middleware/auth"
import connectDB from "@/lib/db/connection"
import Seo from "@/lib/models/Seo"

export async function GET(request: NextRequest) {
    try {
        const user = await authenticate(request)
        await connectDB()

        const { searchParams } = new URL(request.url)
        const page = Number.parseInt(searchParams.get("page") || "1")
        const limit = Number.parseInt(searchParams.get("limit") || "10")
        const search = searchParams.get("search")
        const type = searchParams.get("type")

        const query: any = {}

        if (search) {
            query.$or = [
                { type: { $regex: search, $options: "i" } },
                { metaTitle: { $regex: search, $options: "i" } },
                { metaDescription: { $regex: search, $options: "i" } },
            ]
        }

        if (type) {
            query.type = type.toLowerCase()
        }

        const skip = (page - 1) * limit
        const seoData = await Seo.find(query)
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)

        const total = await Seo.countDocuments(query)

        return NextResponse.json({
            success: true,
            data: seoData,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        })
    } catch (error: any) {
        console.error("Get SEO data error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Failed to fetch SEO data" },
            { status: error.message === "Authentication failed" ? 401 : 500 },
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await authenticate(request)
        await connectDB()

        const body = await request.json()
        console.log("Request Body:", body) // Debug log
        const { type, metaTitle, metaDescription, metaKeywords } = body

        if (!type || !metaTitle || !metaDescription || !metaKeywords) {
            return NextResponse.json(
                { success: false, error: "All fields are required" },
                { status: 400 }
            )
        }

        const existingSEO = await Seo.findOne({ type: type.toLowerCase() })
        if (existingSEO) {
            return NextResponse.json(
                { success: false, error: "SEO data for this page already exists" },
                { status: 400 }
            )
        }

        const newSEO = await Seo.create({
            type: type.toLowerCase(),
            metaTitle,
            metaDescription,
            metaKeywords,
        })

        return NextResponse.json(
            {
                success: true,
                message: "SEO data created successfully",
                data: newSEO,
            },
            { status: 201 }
        )
    } catch (error: any) {
        console.error("Create SEO data error:", error)
        return NextResponse.json(
            { success: false, error: error.message || "Failed to create SEO data" },
            { status: error.message === "Authentication failed" ? 401 : 500 },
        )
    }
}
