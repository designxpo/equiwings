import { type NextRequest, NextResponse } from "next/server"
import { seedDatabase } from "@/lib/db/seed"

export async function POST(request: NextRequest) {
  try {
    // Only allow in development or with special key
    const authKey = request.headers.get("x-init-key")
    if (process.env.NODE_ENV === "production" && authKey !== process.env.INIT_SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await seedDatabase()

    return NextResponse.json({
      message: "Database initialized successfully",
    })
  } catch (error: any) {
    console.error("Database initialization error:", error)
    return NextResponse.json({ error: "Failed to initialize database" }, { status: 500 })
  }
}
