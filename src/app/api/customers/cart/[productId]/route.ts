import connectDB from "@/lib/db/connection"
import { authenticate } from "@/lib/middleware/auth"
import Cart from "@/lib/models/Cart"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
    try {
        const user = await authenticate(request)
        const { productId } = await params
        await connectDB()

        const cart = await Cart.findOne({ user: user._id })
        if (!cart) {
            return NextResponse.json(
                { error: "Cart not found" },
                { status: 404 }
            )
        }

        const initialItemCount = cart.items.length

        // Remove the product from the cart items
        cart.items = cart.items.filter(
            (item: any) => item.product.toString() !== productId
        )

        if (cart.items.length === initialItemCount) {
            return NextResponse.json(
                { error: "Product is not in your cart" },
                { status: 404 }
            )
        }

        await cart.save()

        return NextResponse.json(
            { message: "Product removed from your cart" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error removing product from cart:", error)
        return NextResponse.json(
            { error: "Failed to remove product from cart" },
            { status: 500 }
        )
    }
}
