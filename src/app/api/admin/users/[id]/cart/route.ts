import connectDB from '@/lib/db/connection';
import { authenticate, authorize } from '@/lib/middleware/auth';
import Cart from '@/lib/models/Cart';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        await authenticate(request);
        await connectDB();

        const cart = await Cart.findOne({ user: new mongoose.Types.ObjectId(id) })
            .populate('items.product')
            .lean();

        if (!cart) {
            return NextResponse.json(
                { cart: [], error: 'Cart not found' },
                { status: 404 }
            );
        }

        // Filter out items where product is null
        const filteredCart = Array.isArray(cart) ? cart.map(c => ({
            ...c,
            items: c.items?.filter((item: { product: null; }) => item.product !== null) || []
        })) : {
            ...cart,
            items: cart.items?.filter((item: any) => item.product !== null) || []
        };

        return NextResponse.json(
            { cart: filteredCart, message: 'Cart retrieved successfully' },
            { status: 200 }
        );
    } catch (err) {
        console.error('Error retrieving cart:', err);
        return NextResponse.json(
            { error: 'Failed to retrieve cart' },
            { status: 500 }
        );
    }
}