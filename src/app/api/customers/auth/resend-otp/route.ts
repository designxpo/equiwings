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

        // Find the user
        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        if (user.isEmailVerified) {
            return NextResponse.json({ message: "Email is already verified" }, { status: 400 })
        }

        // Generate new OTP
        const newOtp = generateOTP()
        user.emailVerificationToken = newOtp
        await user.save()

        // Send OTP again using the same template
        const isOtpSent = await sendEmail({
            to: email,
            templateName: "EMAIL_VERIFICATION",
            variables: {
                firstName: user.firstName,
                otp: newOtp,
                siteName: "Your Store",
            },
        })

        return NextResponse.json({
            isOtpSent,
            message: "OTP resent successfully",
            otp: newOtp,
        })
    } catch (error: any) {
        console.error("Resend OTP error:", error)
        return NextResponse.json({ error: "Failed to resend OTP" }, { status: 500 })
    }
}
