import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import User from "@/lib/models/User"
import { generateOTP } from "@/lib/utils/jwt"
import { sendEmail } from "@/lib/utils/email"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { email } = body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Generate OTP
    const otp = generateOTP()

    // Update user with reset token and expiry
    user.passwordResetToken = otp
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    await user.save()

    // Send reset email
    await sendEmail({
      to: email,
      templateName: "PASSWORD_RESET",
      variables: {
        firstName: user.firstName,
        otp,
        siteName: "Your Store",
      },
    })

    return NextResponse.json({
      message: "Password reset OTP sent to your email",
    })
  } catch (error: any) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 })
  }
}
