import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Cart from "@/lib/models/Cart"
import Product from "@/lib/models/Product"
import { authenticate } from "@/lib/middleware/auth"
import mongoose from "mongoose"


export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await params
    const productId = new mongoose.Types.ObjectId(id)

    // 1. Check authentication first
    let user = null
    let isAuthenticated = false

    try {
      user = await authenticate(request)
      if (user) {
        // await authorize(user, "CART", "CREATE")
        isAuthenticated = true
      }
    } catch (authError) {
      return NextResponse.json(
        {
          error: "Authentication required",
          message: "Please authenticate first to add items to cart",
          authenticated: false
        },
        { status: 401 }
      )
    }

    if (!isAuthenticated || !user) {
      return NextResponse.json(
        {
          error: "Authentication required",
          message: "Please authenticate first to add items to cart",
          authenticated: false
        },
        { status: 401 }
      )
    }

    /* 2. Parse & validate body */
    const { quantity = 1, size, color } = await request.json()

    if (!productId || quantity <= 0) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          message: 'Product ID and a positive quantity are required',
          authenticated: true
        },
        { status: 400 }
      )
    }

    /* 3. Verify product exists & stock */
    const product = await Product.findOne({ _id: productId, isActive: true })
    if (!product) {
      return NextResponse.json(
        {
          error: 'Product not found',
          message: 'The requested product does not exist or is not available',
          authenticated: true
        },
        { status: 404 }
      )
    }

    if (product.quantity < quantity) {
      return NextResponse.json(
        {
          error: 'Insufficient stock',
          message: `Only ${product.quantity} items available in stock`,
          authenticated: true,
          availableStock: product.quantity
        },
        { status: 400 }
      )
    }

    /* 4. Get or create cart */
    let cart = await Cart.findOne({ user: user._id })
    if (!cart) {
      cart = new Cart({ user: user._id, items: [] })
    }

    /* 5. Add / update variant line */
    const matchVariant = (item: any) =>
      item.product.equals(productId) &&
      (item.size ?? null) === (size ?? null) &&
      (item.color ?? null) === (color ?? null)

    const existingItemIndex = cart.items.findIndex(matchVariant)

    if (existingItemIndex > -1) {
      // Update existing item
      const newQuantity = cart.items[existingItemIndex].quantity + quantity

      // Guard: adding shouldn't exceed available stock
      if (product.quantity < newQuantity) {
        return NextResponse.json(
          {
            error: 'Insufficient stock for update',
            message: `Cannot add ${quantity} more items. Only ${product.quantity - cart.items[existingItemIndex].quantity} items can be added`,
            authenticated: true,
            currentCartQuantity: cart.items[existingItemIndex].quantity,
            availableStock: product.quantity
          },
          { status: 400 }
        )
      }

      cart.items[existingItemIndex].quantity = newQuantity
      cart.items[existingItemIndex].price = product.price // Update price in case it changed
    } else {
      // Add new item
      cart.items.push({
        product: product._id,
        quantity,
        size,
        color,
        price: product.price,
      } as any)
    }

    /* 6. Save (pre‑save hook calculates total) */
    await cart.save()

    /* 7. Populate product fields for UI */
    await cart.populate('items.product', 'name mainImage price sizes colors')

    return NextResponse.json(
      {
        message: 'Item added to cart successfully',
        cart,
        authenticated: true,
        user: {
          id: user._id,
          authenticated: true
        }
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Add‑to‑cart error:', error)

    // Check if it's an authentication error
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json(
        {
          error: "Authentication failed",
          message: "Invalid or expired token. Please login again",
          authenticated: false
        },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to add item to cart',
        message: 'An unexpected error occurred. Please try again',
        authenticated: true
      },
      { status: 500 }
    )
  }
}