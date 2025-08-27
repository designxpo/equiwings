import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Permission from "@/lib/models/Permission"
import { authenticate, authorize } from "@/lib/middleware/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request)
    await authorize(user, "ROLE", "READ")
    await connectDB()

    const permissions = await Permission.find().sort({ resource: 1, action: 1 })

    // Group permissions by resource
    const groupedPermissions = permissions.reduce((acc: any, permission) => {
      if (!acc[permission.resource]) {
        acc[permission.resource] = []
      }
      acc[permission.resource].push(permission)
      return acc
    }, {})

    return NextResponse.json({
      permissions,
      groupedPermissions,
    })
  } catch (error: any) {
    console.error("Get permissions error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch permissions" },
      { status: error.message === "Authentication failed" ? 401 : 500 },
    )
  }
}
