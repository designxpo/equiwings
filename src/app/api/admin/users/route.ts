import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import User from "@/lib/models/User"
import Role from "@/lib/models/Role"
import { authenticate, authorize } from "@/lib/middleware/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request)
    await authorize(user, "USER", "READ")
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search")
    const role = searchParams.get("role")

    // Get roles with level 2
    const level2Roles = await Role.find({ level: 2 }).select("_id")
    const level2RoleIds = level2Roles.map(role => role._id)

    // Build query with role level filter
    const query: any = {
      role: { $in: level2RoleIds } // Filter for users with roles that have level 2
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ]
    }

    if (role) {
      const roleDoc = await Role.findOne({
        name: role.toUpperCase(),
        level: 2 // Ensure the specified role has level 2
      })
      if (roleDoc) {
        query.role = roleDoc._id
      } else {
        // If specified role doesn't exist or doesn't have level 2, return empty result
        return NextResponse.json({
          users: [],
          pagination: {
            page,
            limit,
            total: 0,
            pages: 0,
          },
        })
      }
    }

    // Execute query with pagination
    const skip = (page - 1) * limit
    const users = await User.find(query)
      .populate("role", "name level")
      .select("-password -emailVerificationToken -passwordResetToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await User.countDocuments(query)

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Get users error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch users" },
      { status: error.message === "Authentication failed" ? 401 : 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request)
    await authorize(user, "USER", "CREATE")
    await connectDB()

    const body = await request.json()
    const { firstName, lastName, email, password, phoneNumber, countryCode } = body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      countryCode,
      role: "68693ccadfae729cedaaf95a",
      isEmailVerified: true, // Admin created users are auto-verified
    })

    // Return user without password
    const userResponse = await User.findById(newUser._id)
      .populate("role", "name description")
      .select("-password -emailVerificationToken -passwordResetToken")

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userResponse,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Create user error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create user" },
      { status: error.message === "Authentication failed" ? 401 : 500 },
    )
  }
}
