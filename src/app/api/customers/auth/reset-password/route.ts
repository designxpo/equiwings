import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import User from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { email, otp, newPassword } = body

    // Find user with valid reset token
    const user = await User.findOne({
      email,
      passwordResetToken: otp,
      passwordResetExpires: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
    }

    // Update password
    user.password = newPassword
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    return NextResponse.json({
      message: "Password reset successfully",
    })
  } catch (error: any) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Password reset failed" }, { status: 500 })
  }
}
