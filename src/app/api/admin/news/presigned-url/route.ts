// app/api/admin/news/presigned-url/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { authenticate } from "@/lib/middleware/auth"
import { generatePresignedUrl } from "@/lib/utils/s3"

export async function POST(request: NextRequest) {
    try {
        // Authenticate user
        const user = await authenticate(request)

        const { fileName, fileType } = await request.json()

        if (!fileName || !fileType) {
            return NextResponse.json(
                { error: "fileName and fileType are required" },
                { status: 400 }
            )
        }

        // Validate file type
        const isImage = fileType.startsWith("image/")
        const isVideo = fileType.startsWith("video/")

        if (!isImage && !isVideo) {
            return NextResponse.json(
                { error: "Only image and video files are allowed" },
                { status: 400 }
            )
        }

        // Generate presigned URL
        const { uploadUrl, fileUrl, key } = await generatePresignedUrl(
            fileName,
            fileType
        )

        return NextResponse.json({
            uploadUrl, // Temporary URL to upload file to S3
            fileUrl,   // Permanent URL of the file after upload
            key        // S3 key for reference
        })
    } catch (error: any) {
        console.error("Presigned URL generation error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to generate upload URL" },
            { status: error.message === "Authentication failed" ? 401 : 500 }
        )
    }
}