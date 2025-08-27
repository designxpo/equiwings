import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Product from "@/lib/models/Product"
import Cart from "@/lib/models/Cart"
import { authenticate, authorize } from "@/lib/middleware/auth"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    // Build query
    const query: any = { isActive: true }

    if (category) {
      query.category = category.toUpperCase()
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ]
    }

    // Build sort object
    const sort: any = {}
    sort[sortBy] = sortOrder === "asc" ? 1 : -1

    // Execute query with pagination
    const skip = (page - 1) * limit
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("-reviews") // Exclude reviews for list view

    const total = await Product.countDocuments(query)

    // Try to authenticate user (optional)
    let user = null
    let userCart = null
    let isAuthenticated = false

    try {
      user = await authenticate(request)
      if (user) {
        // await authorize(user, "ROLE", "READ")
        isAuthenticated = true

        // Get user's cart
        userCart = await Cart.findOne({ user: user._id })
      }
    } catch (authError) {
      // User is not authenticated, continue without cart info
      console.log("User not authenticated, proceeding without cart info")
    }

    // Enhance products with cart information if user is authenticated
    const enhancedProducts = products.map(product => {
      const productObj = product.toObject()

      if (isAuthenticated && userCart) {
        // Check if this product is in user's cart
        const cartItem = userCart.items.find((item: { product: { _id: { toString: () => string } } }) =>
          item.product._id.toString() === product._id.toString()
        )

        if (cartItem) {
          productObj.inCart = true
          productObj.cartQuantity = cartItem.quantity
          productObj.cartSize = cartItem.size
          productObj.cartColor = cartItem.color
        } else {
          productObj.inCart = false
        }
      } else {
        productObj.inCart = false
      }

      return productObj
    })

    return NextResponse.json({
      products: enhancedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Get products error:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}