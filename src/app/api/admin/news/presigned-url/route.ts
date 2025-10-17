// api/admin/news/presigned-url/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { authenticate } from "@/lib/middleware/auth"
import { getPresignedUploadUrl } from "@/lib/utils/s3"

export async function POST(request: NextRequest) {
    try {
        const user = await authenticate(request)

        const body = await request.json()
        const { fileName, contentType } = body

        if (!fileName || !contentType) {
            return NextResponse.json(
                { error: "fileName and contentType are required" },
                { status: 400 }
            )
        }

        // Validate file type
        const isImage = contentType.startsWith("image/")
        const isVideo = contentType.startsWith("video/")

        if (!isImage && !isVideo) {
            return NextResponse.json(
                { error: "Only image and video files are allowed" },
                { status: 400 }
            )
        }

        const { url, key, fullUrl } = await getPresignedUploadUrl(fileName, contentType)

        return NextResponse.json({
            uploadUrl: url,
            key,
            fileUrl: fullUrl,
        })
    } catch (error: any) {
        console.error("Presigned URL error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to generate upload URL" },
            { status: error.message === "Authentication failed" ? 401 : 500 }
        )
    }
}