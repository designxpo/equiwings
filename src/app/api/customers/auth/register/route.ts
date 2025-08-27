import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import User from "@/lib/models/User"
import Role from "@/lib/models/Role"
import { generateOTP } from "@/lib/utils/jwt"
import { sendEmail } from "@/lib/utils/email"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { firstName, lastName, email, password, phoneNumber, countryCode } = body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Get customer role
    const customerRole = await Role.findOne({ name: "CUSTOMER" })
    if (!customerRole) {
      return NextResponse.json({ error: "Customer role not found" }, { status: 500 })
    }

    // Generate OTP
    const otp = generateOTP()

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      countryCode,
      role: customerRole._id,
      emailVerificationToken: otp,
    })

    // Send verification email
    const isOtpSent = await sendEmail({
      to: email,
      templateName: "EMAIL_VERIFICATION",
      variables: {
        firstName,
        otp,
        siteName: "Your Store",
      },
    })

    return NextResponse.json(
      {
        isOtpSent,
        message: "User registered successfully. Please verify your email.",
        otp,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}