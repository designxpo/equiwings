import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import News from "@/lib/models/News"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""

    const query: any = { isActive: true }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    const newsList = await News.find(query).sort({ createdAt: -1 })

    return NextResponse.json({
      news: newsList,
    })
  } catch (error: any) {
    console.error("Get news error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch news" },
      { status: 500 }
    )
  }
}
