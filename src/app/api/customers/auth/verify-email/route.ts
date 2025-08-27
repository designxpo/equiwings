import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import User from "@/lib/models/User"
import { generateToken } from "@/lib/utils/jwt"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { email, otp } = body

    // Find user
    const user = await User.findOne({
      email,
      emailVerificationToken: otp,
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid OTP or email" }, { status: 400 })
    }

    // Update user
    user.isEmailVerified = true
    user.emailVerificationToken = null
    await user.save()

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role.name,
    })

    return NextResponse.json({
      token,
      message: "Email verified successfully",
    })
  } catch (error: any) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Email verification failed" }, { status: 500 })
  }
}
