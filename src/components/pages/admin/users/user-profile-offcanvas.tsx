"use client"

import axiosInstance from "@/lib/config/axios"
import { Loader } from "@/utils/loaders"
import Link from "next/link"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import {
    LuX,
    LuUser,
    LuMail,
    LuCalendar,
    LuShield,
    LuShoppingCart,
    LuCheck,
    LuClock,
    LuStar,
    LuEye,
    LuExternalLink,
} from "react-icons/lu"

interface UserRole {
    _id: string
    name: string
}

interface UserProfile {
    _id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    countryCode: string
    role: UserRole
    isEmailVerified: boolean
    createdAt: string
    updatedAt: string
}

interface Product {
    productId: string
    _id: string
    name: string
    description: string
    category: string
    price: number
    sizes: string[]
    colors: string[]
    quantity: number
    mainImage: string
    additionalImages: string[]
    ratings: {
        average: number
        count: number
    }
    isActive: boolean
    reviews: any[]
    createdAt: string
    updatedAt: string
    __v: number
}

interface CartItem {
    product: Product
    quantity: number
    price: number
    _id: string
}

interface Cart {
    _id: string
    user: string
    items: CartItem[]
    totalAmount: number
    createdAt: string
    updatedAt: string
    __v: number
}

interface UserProfileOffcanvasProps {
    isOpen: boolean
    onClose: () => void
    userId: string
}

export default function UserProfileOffcanvas({ isOpen, onClose, userId }: UserProfileOffcanvasProps) {
    const [activeTab, setActiveTab] = useState<"profile" | "cart">("profile")
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [userCart, setUserCart] = useState<Cart | null>(null)
    const [loading, setLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (isOpen && userId) {
            setIsVisible(true)
            fetchUserProfile()
            fetchUserCart()
        } else if (!isOpen) {
            setIsVisible(false)
        }
    }, [isOpen, userId])

    const fetchUserProfile = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(`/admin/users/${userId}`)
            setUserProfile(response.data.user)
        } catch (error: any) {
            console.log(error.response.data.error || "Failed to fetch user profile:")
        } finally {
            setLoading(false)
        }
    }

    const fetchUserCart = async () => {
        try {
            const response = await axiosInstance.get(`/admin/users/${userId}/cart`)
            setUserCart(response.data.cart)
        } catch (error: any) {
            console.log(error.response.data.error || "Failed to fetch user cart")
        }
    }

    const handleClose = () => {
        setIsVisible(false)
        setTimeout(() => {
            setUserProfile(null)
            setUserCart(null)
            onClose()
        }, 300)
    }

    const renderStars = (rating = 0) => {
        return Array.from({ length: 5 }, (_, i) => (
            <LuStar
                key={i}
                className={`h-3 w-3 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
            />
        ))
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Background overlay */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${isVisible ? "opacity-50" : "opacity-0"
                    }`}
                onClick={handleClose}
            />

            {/* Sliding panel */}
            <div
                className={`absolute right-0 top-0 h-full w-full max-w-5xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isVisible ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="bg-white px-6 py-4 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <div className="text-black">
                                <h2 className="text-2xl font-bold">User Profile</h2>
                                <p className="text-gray-600 mt-1">Comprehensive user information and activity</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="rounded-full p-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200"
                            >
                                <LuX className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white border-b border-gray-200">
                        <nav className="flex px-6">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${activeTab === "profile"
                                    ? "border-cardinal-pink-800 text-cardinal-pink-800 bg-gray-50"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                <LuUser className="mr-2 h-4 w-4" />
                                Profile Details
                            </button>
                            <button
                                onClick={() => setActiveTab("cart")}
                                className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${activeTab === "cart"
                                    ? "border-cardinal-pink-800 text-cardinal-pink-800 bg-gray-50"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                <LuShoppingCart className="mr-2 h-4 w-4" />
                                Shopping Cart
                                {userCart && userCart.items.length > 0 && (
                                    <span className="ml-2 bg-cardinal-pink-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {userCart.items.length > 9 ? "9+" : userCart.items.length}
                                    </span>
                                )}
                            </button>
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto bg-gray-50">
                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="p-6">
                                {activeTab === "profile" ? (
                                    // Profile Tab Content
                                    <div className="space-y-6">
                                        {userProfile && (
                                            <>
                                                {/* User Avatar & Basic Info */}
                                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                                    <div className="flex items-start space-x-6">
                                                        <div className="bg-cardinal-pink-800 rounded-full h-20 w-20 flex items-center justify-center text-white text-2xl font-bold">
                                                            {userProfile.firstName.charAt(0)}
                                                            {userProfile.lastName.charAt(0)}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                                {userProfile.firstName} {userProfile.lastName}
                                                            </h3>
                                                            <div className="flex items-center space-x-4 mb-3">
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                                    <LuShield className="h-4 w-4 mr-1" />
                                                                    {userProfile.role.name}
                                                                </span>
                                                                {userProfile.isEmailVerified && (
                                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                                        <LuCheck className="h-4 w-4 mr-1" />
                                                                        Email Verified
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-gray-600">Member since {formatDate(userProfile.createdAt)}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Contact Information */}
                                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                        <LuMail className="h-5 w-5 mr-2 text-blue-600" />
                                                        Contact Information
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="space-y-1">
                                                            <label className="text-sm font-medium text-gray-500">Email Address</label>
                                                            <div className="flex items-center space-x-2">
                                                                <p className="text-gray-900 font-medium">{userProfile.email}</p>
                                                                {userProfile.isEmailVerified ? (
                                                                    <LuCheck className="h-4 w-4 text-green-500" />
                                                                ) : (
                                                                    <LuClock className="h-4 w-4 text-yellow-500" />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-sm font-medium text-gray-500">Phone Number</label>
                                                            <p className="text-gray-900 font-medium">
                                                                {userProfile.countryCode} {userProfile.phoneNumber}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Account Activity */}
                                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                        <LuCalendar className="h-5 w-5 mr-2 text-blue-600" />
                                                        Account Activity
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="bg-gray-50 rounded-lg p-4">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-sm text-gray-500">Account Created</p>
                                                                    <p className="text-lg font-semibold text-gray-900">
                                                                        {formatDate(userProfile.createdAt)}
                                                                    </p>
                                                                </div>
                                                                <LuCalendar className="h-8 w-8 text-blue-500" />
                                                            </div>
                                                        </div>
                                                        <div className="bg-gray-50 rounded-lg p-4">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-sm text-gray-500">Last Updated</p>
                                                                    <p className="text-lg font-semibold text-gray-900">
                                                                        {formatDate(userProfile.updatedAt)}
                                                                    </p>
                                                                </div>
                                                                <LuClock className="h-8 w-8 text-green-500" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    // Cart Tab Content
                                    <div className="space-y-6">
                                        {/* Cart Summary */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                                <div className="flex items-center">
                                                    <div className="bg-blue-100 rounded-lg p-3">
                                                        <LuShoppingCart className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="text-sm text-gray-500">Total Items</p>
                                                        <p className="text-2xl font-bold text-gray-900">
                                                            {userCart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                                <div className="flex items-center">
                                                    <div className="bg-green-100 rounded-lg p-3">
                                                        <LuCheck className="h-6 w-6 text-green-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="text-sm text-gray-500">Unique Products</p>
                                                        <p className="text-2xl font-bold text-gray-900">{userCart?.items.length || 0}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                                <div className="flex items-center">
                                                    <div className="bg-purple-100 rounded-lg p-3">
                                                        <span className="text-purple-600 font-bold text-lg">$</span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="text-sm text-gray-500">Total Value</p>
                                                        <p className="text-2xl font-bold text-gray-900">
                                                            ${userCart?.totalAmount.toFixed(2) || "0.00"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>

                                        {/* Cart Items */}
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                            <div className="p-6 border-b border-gray-200">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Shopping Cart
                                                    {userCart && userCart.items.length > 0 && (
                                                        <span className="ml-2 text-sm text-gray-500">
                                                            ({userCart.items.length} {userCart.items.length === 1 ? "item" : "items"})
                                                        </span>
                                                    )}
                                                </h3>
                                            </div>
                                            {userCart && userCart.items.length > 0 ? (
                                                <div className="divide-y divide-gray-200">
                                                    {userCart.items.map((item) => (
                                                        <div key={item._id} className="p-6">
                                                            <div className="flex items-start space-x-4">
                                                                <div className="relative">
                                                                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-200">
                                                                        {item.product.mainImage === "dummy link" ? (
                                                                            <div className="text-gray-400 text-xs text-center">
                                                                                <LuShoppingCart className="h-6 w-6 mx-auto mb-1" />
                                                                                No Image
                                                                            </div>
                                                                        ) : (
                                                                            <img
                                                                                src={item.product.mainImage || "/placeholder.svg"}
                                                                                alt={item.product.name}
                                                                                className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-start justify-between">
                                                                        <div className="flex-1">
                                                                            <h4 className="text-lg font-medium text-gray-900 mb-1">{item.product.name}</h4>

                                                                            {/* Product Description */}
                                                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                                                {item.product.description}
                                                                            </p>

                                                                            {/* Product Details */}
                                                                            <div className="flex flex-wrap items-center gap-4 mb-3">
                                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                                                    {item.product.category}
                                                                                </span>

                                                                                {/* Available Sizes */}
                                                                                {item.product.sizes.length > 0 && (
                                                                                    <div className="flex items-center space-x-1">
                                                                                        <span className="text-sm text-gray-600">Sizes:</span>
                                                                                        {item.product.sizes.map((size, index) => (
                                                                                            <span
                                                                                                key={index}
                                                                                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                                                                                            >
                                                                                                {size}
                                                                                            </span>
                                                                                        ))}
                                                                                    </div>
                                                                                )}

                                                                                {/* Available Colors */}
                                                                                {item.product.colors.length > 0 && (
                                                                                    <div className="flex items-center space-x-1">
                                                                                        <span className="text-sm text-gray-600">Colors:</span>
                                                                                        {item.product.colors.map((color, index) => (
                                                                                            <span key={index} className="flex items-center space-x-1">
                                                                                                <span
                                                                                                    className="w-4 h-4 rounded-full border border-gray-300"
                                                                                                    style={{ backgroundColor: color }}
                                                                                                ></span>
                                                                                                <span className="text-xs capitalize">{color}</span>
                                                                                            </span>
                                                                                        ))}
                                                                                    </div>
                                                                                )}
                                                                            </div>

                                                                            {/* Ratings */}
                                                                            <div className="flex items-center space-x-2 mb-2">
                                                                                <div className="flex items-center">
                                                                                    {renderStars(item.product.ratings.average)}
                                                                                </div>
                                                                                <span className="text-sm text-gray-600">
                                                                                    {item.product.ratings.average.toFixed(1)} ({item.product.ratings.count}{" "}
                                                                                    reviews)
                                                                                </span>
                                                                            </div>

                                                                            {/* Quantity and Stock */}
                                                                            <div className="flex items-center space-x-4 mb-3">
                                                                                <div className="flex items-center space-x-2">
                                                                                    <span className="text-sm text-gray-600">Cart Qty:</span>
                                                                                    <span className="font-medium text-gray-900">{item.quantity}</span>
                                                                                </div>
                                                                                <div className="text-sm text-gray-600">
                                                                                    Stock:{" "}
                                                                                    <span
                                                                                        className={`font-medium ${item.product.quantity > 10
                                                                                            ? "text-green-600"
                                                                                            : item.product.quantity > 0
                                                                                                ? "text-yellow-600"
                                                                                                : "text-red-600"
                                                                                            }`}
                                                                                    >
                                                                                        {item.product.quantity > 0
                                                                                            ? `${item.product.quantity} available`
                                                                                            : "Out of stock"}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="text-sm text-gray-600">
                                                                                    Status:{" "}
                                                                                    <span
                                                                                        className={`font-medium ${item.product.isActive ? "text-green-600" : "text-red-600"}`}
                                                                                    >
                                                                                        {item.product.isActive ? "Active" : "Inactive"}
                                                                                    </span>
                                                                                </div>
                                                                            </div>

                                                                            {/* View Product Button */}
                                                                            <Link
                                                                                href={`/admin/products?productId=${item.product.productId}`}
                                                                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-cardinal-pink-800 bg-cardinal-pink-50 border border-cardinal-pink-200 rounded-md hover:bg-cardinal-pink-100 transition-colors duration-200"
                                                                            >
                                                                                <LuEye className="h-4 w-4 mr-1" />
                                                                                View Product
                                                                                <LuExternalLink className="h-3 w-3 ml-1" />
                                                                            </Link>
                                                                        </div>
                                                                        <div className="text-right ml-4">
                                                                            <div className="text-sm text-gray-500 mb-1">${item.price.toFixed(2)} each</div>
                                                                            <div className="text-xl font-bold text-gray-900">
                                                                                ${(item.price * item.quantity).toFixed(2)}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {/* Cart Total */}
                                                    {/* <div className="p-6 bg-gray-50">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-lg font-semibold text-gray-900">Cart Total</p>
                                                                <p className="text-sm text-gray-600">Last updated: {formatDate(userCart.updatedAt)}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-2xl font-bold text-gray-900">${userCart.totalAmount.toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                </div>
                                            ) : (
                                                <div className="p-12 text-center">
                                                    <LuShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Cart is Empty</h3>
                                                    <p className="text-gray-600">This user hasn't added any items to their cart yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
