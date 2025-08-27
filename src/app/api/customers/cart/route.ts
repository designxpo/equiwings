import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Cart from "@/lib/models/Cart"
import Product from "@/lib/models/Product"
import { authenticate, authorize } from "@/lib/middleware/auth"
import mongoose from "mongoose"

export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request)
    await connectDB()

    const cart = await Cart.findOne({ user: user._id }).populate("items.product", "name mainImage price")

    if (!cart) {
      return NextResponse.json({
        cart: { items: [], totalAmount: 0 },
      })
    }

    return NextResponse.json({ cart })
  } catch (error: any) {
    console.error("Get cart error:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}
