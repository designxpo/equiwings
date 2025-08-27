import { type NextRequest, NextResponse } from "next/server"
import { authenticate, authorize } from "@/lib/middleware/auth"
import { uploadToS3 } from "@/lib/utils/s3"

export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request)
    await authorize(user, "PRODUCT", "CREATE")

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." }, { status: 400 })
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const url = await uploadToS3(buffer, file.name, file.type)

    return NextResponse.json({
      message: "File uploaded successfully",
      url,
    })
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: error.message === "Authentication failed" ? 401 : 500 },
    )
  }
}
