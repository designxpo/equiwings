import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Announcement from "@/lib/models/Announcement"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""

    const query: any = {
      isActive: true,
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    const announcementList = await Announcement.find(query).sort({ createdAt: -1 })

    return NextResponse.json({
      announcement: announcementList,
    })
  } catch (error: any) {
    console.error("Get announcement error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch announcements" },
      { status: 500 }
    )
  }
}
