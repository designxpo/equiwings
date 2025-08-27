import { NextResponse, type NextRequest } from "next/server"
import { verifyToken } from "../utils/jwt"
import "../models/Permission" // Add this import
import "../models/Role"
import User from "../models/User"
import connectDB from "../db/connection"

export interface AuthenticatedRequest extends NextRequest {
  user?: any
}

export async function authenticate(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      throw new Error("Token not found")
    }

    const decoded = verifyToken(token)

    await connectDB()
    const user = await User.findById(decoded.userId).populate({
      path: "role",
      populate: {
        path: "permissions",
      },
    })

    if (!user) {
      throw new Error("User not found")
    }

    if (!user.isEmailVerified) {
      throw new Error("Email not verified")
    }

    return user
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export function hasPermission(userPermissions: any[], resource: string, action: string): boolean {
  return userPermissions.some(
    (permission) =>
      permission.resource === resource && (permission.action === action || permission.action === "MANAGE"),
  )
}

export async function authorize(user: any, resource: string, action: string) {
  const permissions = user.role.permissions

  if (!hasPermission(permissions, resource, action)) {
    throw new Error("Insufficient permissions")
  }

  return true
}
