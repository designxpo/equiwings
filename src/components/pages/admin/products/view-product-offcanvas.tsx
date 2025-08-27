"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import { FiX, FiStar, FiPackage, FiCalendar, FiUser, FiMessageCircle, FiClock, FiTag, FiBox, FiTrendingUp, FiDollarSign, FiHash, FiEye, FiEyeOff } from "react-icons/fi"

type Product = {
    _id: string
    name: string
    description: string
    price: number
    category: string
    sizes: string[]
    colors: string[]
    quantity: number
    mainImage: string
    additionalImages: string[]
    ratings: {
        average: number
        count: number
    }
    reviews: {
        reviewerName: string
        rating: number
        comment: string
        createdAt: string
    }[]
    isActive: boolean
    createdAt: string
    updatedAt: string
}

interface ViewProductOffcanvasProps {
    isOpen: boolean
    onClose: () => void
    product: Product | null
}

export default function ViewProductOffcanvas({ isOpen, onClose, product }: ViewProductOffcanvasProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)

    const dummyProduct: Product = {
        _id: "64f8a1b2c3d4e5f6a7b8c9d0",
        name: "Premium Organic Cotton T-Shirt",
        description: "A comfortable and stylish premium cotton t-shirt perfect for everyday wear. Made from 100% organic cotton with a modern fit.",
        price: 29.99,
        category: "TSHIRTS",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        colors: ["#000000", "#ffffff", "#ff0000", "#0000ff", "#008000"],
        quantity: 150,
        mainImage: "/placeholder.svg?height=400&width=400",
        additionalImages: [
            "/placeholder.svg?height=400&width=400",
            "/placeholder.svg?height=400&width=400",
            "/placeholder.svg?height=400&width=400",
        ],
        ratings: { average: 4.7, count: 186 },
        reviews: [
            {
                reviewerName: "Sarah Johnson",
                rating: 5,
                comment: "Absolutely love this t-shirt! The quality is amazing and it fits perfectly.",
                createdAt: "2024-01-15T10:30:00Z",
            },
            {
                reviewerName: "Mike Chen",
                rating: 4,
                comment: "Great quality shirt. The fit is true to size and the material feels premium.",
                createdAt: "2024-01-10T14:22:00Z",
            },
        ],
        isActive: true,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-20T12:00:00Z",
    }

    const displayProduct = product || dummyProduct
    const allImages = [displayProduct.mainImage, ...displayProduct.additionalImages]

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset"
        return () => { document.body.style.overflow = "unset" }
    }, [isOpen])

    const getStockStatus = (quantity: number) => {
        if (quantity === 0) return { text: "Out of Stock", class: "bg-red-50 text-red-600 border-red-200" }
        if (quantity < 20) return { text: "Low Stock", class: "bg-yellow-50 text-yellow-600 border-yellow-200" }
        return { text: "In Stock", class: "bg-green-50 text-green-600 border-green-200" }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <FiStar
                key={index}
                className={`h-4 w-4 ${index < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
            />
        ))
    }

    const getColorName = (hex: string) => {
        const colorNames: { [key: string]: string } = {
            "#000000": "Black", "#ffffff": "White", "#ff0000": "Red",
            "#0000ff": "Blue", "#008000": "Green", "#ffff00": "Yellow",
        }
        return colorNames[hex.toLowerCase()] || hex
    }

    if (!isOpen) return null

    const stockStatus = getStockStatus(displayProduct.quantity)

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Offcanvas */}
            <div className="fixed top-0 right-0 h-full w-full max-w-4xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-cardinal-pink-950 rounded-lg">
                                <FiPackage className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
                                <p className="text-sm text-gray-500">Complete product information</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FiX className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Product Hero */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Images */}
                                <div className="space-y-4">
                                    <div className="aspect-square bg-white rounded-lg overflow-hidden border border-gray-200">
                                        <Image
                                            src="/placeholder.svg"
                                            alt={displayProduct.name}
                                            width={400}
                                            height={400}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {allImages.length > 1 && (
                                        <div className="flex space-x-2 justify-center">
                                            {allImages.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedImageIndex(index)}
                                                    className={`w-12 h-12 rounded-lg border-2 overflow-hidden ${selectedImageIndex === index
                                                        ? "border-cardinal-pink-950"
                                                        : "border-gray-200"
                                                        }`}
                                                >
                                                    <Image
                                                        src="/placeholder.svg"
                                                        alt=""
                                                        width={48}
                                                        height={48}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{displayProduct.name}</h3>
                                        <div className="flex items-center space-x-3 mb-3">
                                            <span className="text-3xl font-bold text-cardinal-pink-950">
                                                ${displayProduct.price}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className="px-3 py-1 bg-cardinal-pink-950 text-white text-sm font-medium rounded-full">
                                                {displayProduct.category}
                                            </span>
                                            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${stockStatus.class}`}>
                                                {stockStatus.text}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed">{displayProduct.description}</p>
                                    </div>

                                    {/* Ratings */}
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="flex">{renderStars(displayProduct.ratings.average)}</div>
                                            <span className="font-semibold text-gray-900">
                                                {displayProduct.ratings.average}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                ({displayProduct.ratings.count} reviews)
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-700">Status</span>
                                                {displayProduct.isActive ? (
                                                    <FiEye className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <FiEyeOff className="h-4 w-4 text-red-500" />
                                                )}
                                            </div>
                                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full mt-2 ${displayProduct.isActive
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                                }`}>
                                                {displayProduct.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-700">Stock</span>
                                                <FiBox className="h-4 w-4 text-gray-500" />
                                            </div>
                                            <span className="text-lg font-bold text-gray-900 mt-2 block">
                                                {displayProduct.quantity}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Specifications */}
                            <div className="bg-white rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center space-x-2 mb-4">
                                    <FiTag className="h-5 w-5 text-cardinal-pink-950" />
                                    <h4 className="font-semibold text-gray-900">Specifications</h4>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">ID</span>
                                        <span className="text-sm font-mono text-gray-900">
                                            {displayProduct._id.slice(-8)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Category</span>
                                        <span className="text-sm font-medium text-gray-900">{displayProduct.category}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Price</span>
                                        <span className="text-sm font-bold text-cardinal-pink-950">${displayProduct.price}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Stock</span>
                                        <span className="text-sm font-medium text-gray-900">{displayProduct.quantity}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="bg-white rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center space-x-2 mb-4">
                                    <FiBox className="h-5 w-5 text-cardinal-pink-950" />
                                    <h4 className="font-semibold text-gray-900">Options</h4>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-sm font-medium text-gray-700 block mb-2">Sizes</span>
                                        <div className="flex flex-wrap gap-1">
                                            {displayProduct.sizes.map((size, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded border"
                                                >
                                                    {size}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-700 block mb-2">Colors</span>
                                        <div className="space-y-2">
                                            {displayProduct.colors.map((color, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <div
                                                        className="w-4 h-4 rounded-full border border-gray-300"
                                                        style={{ backgroundColor: color }}
                                                    />
                                                    <span className="text-xs text-gray-700">{getColorName(color)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-white rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center space-x-2 mb-4">
                                    <FiCalendar className="h-5 w-5 text-cardinal-pink-950" />
                                    <h4 className="font-semibold text-gray-900">Timeline</h4>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Created</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {formatDate(displayProduct.createdAt)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Updated</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {formatDate(displayProduct.updatedAt)}
                                        </span>
                                    </div>
                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <FiClock className="h-4 w-4 text-gray-500" />
                                            <span className="text-xs text-gray-600">
                                                {displayProduct.isActive ? 'Currently active' : 'Currently inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 p-6 bg-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>ID: {displayProduct._id.slice(-8)}</span>
                                <span>Rating: {displayProduct.ratings.average}</span>
                                <span>Stock: {displayProduct.quantity}</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-cardinal-pink-950 text-white font-medium rounded-lg hover:bg-cardinal-pink-900 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}