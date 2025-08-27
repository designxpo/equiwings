import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import User from "@/lib/models/User"
import { generateToken } from "@/lib/utils/jwt"

import Role from "@/lib/models/Role"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { email, password } = body

    // Find user and populate role
    const user = await User.findOne({ email }).populate({
      path: "role",
      model: Role, // Explicitly specify the model
    })
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (user.role.name !== "CUSTOMER") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return NextResponse.json({ error: "Please verify your email first" }, { status: 401 })
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role.name,
    })

    return NextResponse.json({
      message: "Login successful",
      token,
    })
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}

