import React from 'react'
import { motion } from 'framer-motion'
import { LuRefreshCcw, LuTrash2 } from 'react-icons/lu'
import axiosInstance from '@/lib/config/axios'
import toast from 'react-hot-toast'
import { useCustomerAuth } from '@/providers/customer-auth-context'
import { FaShoppingCart } from 'react-icons/fa'
import BuyNowModal from '../modals/wa'

type CartItem = {
    _id: string
    product: {
        _id: string
        name: string
        price: number
        mainImage: string
        productId?: string // Add productId to match BuyNowModal requirements
    }
    quantity: number
    size: string
    color: string
    price: number
}

type CartProps = {
    items: CartItem[]
    toggleCart: () => void
    isCartOpen: boolean
}

const Cart: React.FC<CartProps> = ({ items, toggleCart, isCartOpen }) => {
    const { fetchCart } = useCustomerAuth();
    const [loading, setLoading] = React.useState(false);
    const [buyNowModalOpen, setBuyNowModalOpen] = React.useState(false);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const removeItem = async (itemId: string) => {
        setLoading(true);
        try {
            const res = await axiosInstance.delete(`/customers/cart/${itemId}`);
            toast.success("Item removed from cart!");
            fetchCart();
        } catch (err: any) {
            toast.error(err.response.data.error || "Failed to remove item from cart");
        } finally {
            setLoading(false);
        }
    }

    const handleBuyNow = () => {
        setBuyNowModalOpen(true);
    }

    const handleCloseBuyNowModal = () => {
        setBuyNowModalOpen(false);
    }

    return (
        <>
            <div className="fixed inset-0 z-50 overflow-hidden">
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black ${isCartOpen ? 'opacity-50' : 'opacity-0'}`}
                    onClick={toggleCart}
                />

                {/* Off-canvas Panel */}
                <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl">
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
                        className="h-full flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
                            <button
                                onClick={toggleCart}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {items.length === 0 ? (
                                <div className="text-center py-8">
                                    <FaShoppingCart className="text-xl w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">Your cart is empty</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                            <img
                                                src={item.product.mainImage}
                                                alt={item.product.name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                <p className="text-sm text-gray-600">Size: {item.size} | Color: {item.color}</p>
                                                <p className="text-sm font-medium text-purple-800">${item.price}</p>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.product._id)}
                                                className="p-2 hover:cursor-pointer text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <LuRefreshCcw className="w-6 h-6 animate-spin" />
                                                ) : (
                                                    <LuTrash2 className="w-6 h-6" />
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t border-gray-200 px-6 py-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                                    <span className="text-lg font-bold text-purple-800">${total.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={handleBuyNow}
                                    className="w-full bg-gradient-to-t from-[#780083] to-[#5B297A] hover:from-[#5B297A] hover:to-[#780083] text-white py-3 rounded-md font-medium transition-all duration-200"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* BuyNowModal for cart items */}
            <BuyNowModal
                isOpen={buyNowModalOpen}
                onClose={handleCloseBuyNowModal}
                cartItems={items}
            />
        </>
    )
}

export default Cart