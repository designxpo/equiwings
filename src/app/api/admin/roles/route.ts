import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Role from "@/lib/models/Role"
import Permission from "@/lib/models/Permission"
import { authenticate, authorize } from "@/lib/middleware/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request)
    await authorize(user, "ROLE", "READ")
    await connectDB()

    const roles = await Role.find().populate("permissions", "name description resource action").sort({ createdAt: -1 })

    return NextResponse.json({ roles })
  } catch (error: any) {
    console.error("Get roles error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch roles" },
      { status: error.message === "Authentication failed" ? 401 : 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request)
    await authorize(user, "ROLE", "CREATE")
    await connectDB()

    const body = await request.json()
    const { name, description, permissionIds } = body

    // Check if role already exists
    const existingRole = await Role.findOne({ name: name.toUpperCase() })
    if (existingRole) {
      return NextResponse.json({ error: "Role already exists" }, { status: 400 })
    }

    // Validate permissions
    const permissions = await Permission.find({ _id: { $in: permissionIds } })
    if (permissions.length !== permissionIds.length) {
      return NextResponse.json({ error: "Some permissions not found" }, { status: 400 })
    }

    // Create role
    const role = await Role.create({
      name: name.toUpperCase(),
      description,
      permissions: permissionIds,
    })

    // Return populated role
    const populatedRole = await Role.findById(role._id).populate("permissions", "name description resource action")

    return NextResponse.json(
      {
        message: "Role created successfully",
        role: populatedRole,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Create role error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create role" },
      { status: error.message === "Authentication failed" ? 401 : 500 },
    )
  }
}
