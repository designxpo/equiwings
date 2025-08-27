import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Product from "@/lib/models/Product"
import Cart from "@/lib/models/Cart"
import { authenticate, authorize } from "@/lib/middleware/auth"


export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        await connectDB()

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
            console.log("User not authenticated, proceeding without cart info")
        }

        // Find the product by ID and ensure it's active
        const product = await Product.findOne({ productId: id, isActive: true })

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 })
        }

        // Convert to object and enhance with cart info if authenticated
        const productObj = product.toObject()

        if (isAuthenticated && userCart) {
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

        return NextResponse.json({ product: productObj })
    } catch (error: any) {
        console.error("Get single product error:", error)
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
    }
}
