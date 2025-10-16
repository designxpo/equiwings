"use client"
import type React from "react"
import { useState, useEffect } from "react"
import axiosInstance from "@/lib/config/axios"
import { FiAlertTriangle, FiEye, FiX } from "react-icons/fi"
import toast from "react-hot-toast"

interface Gallery {
    _id: string
    title: string
    image: string
    category: string
    order: number
    isActive: boolean
    createdAt: string
    updatedAt: string
}

interface GalleryViewOffcanvasProps {
    isOpen: boolean
    onClose: () => void
    galleryId: string
}

export function GalleryViewOffcanvas({ isOpen, onClose, galleryId }: GalleryViewOffcanvasProps) {
    const [loading, setLoading] = useState(true)
    const [isAnimating, setIsAnimating] = useState(false)
    const [gallery, setGallery] = useState<Gallery | null>(null)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true)
            document.body.style.overflow = "hidden"
            fetchGallery()
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen, galleryId])

    const fetchGallery = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(`/admin/gallery/${galleryId}`)
            setGallery(response.data.gallery)
            setError("")
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || "Failed to load gallery item"
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        if (!loading) {
            setIsAnimating(false)
            setTimeout(() => {
                onClose()
            }, 300)
        }
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose()
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            sports: "bg-blue-100 text-blue-800 border-blue-200",
            events: "bg-purple-100 text-purple-800 border-purple-200",
            facilities: "bg-green-100 text-green-800 border-green-200",
            achievements: "bg-yellow-100 text-yellow-800 border-yellow-200",
            training: "bg-orange-100 text-orange-800 border-orange-200",
            other: "bg-gray-100 text-gray-800 border-gray-200",
        }
        return colors[category] || colors.other
    }

    const getStatusBadge = (isActive: boolean) => {
        return isActive
            ? "bg-green-100 text-green-800 border-green-200"
            : "bg-red-100 text-red-800 border-red-200"
    }

    if (!isOpen && !isAnimating) return null

    return (
        <div className="fixed inset-0 z-50">
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${isOpen && isAnimating ? "opacity-50" : "opacity-0"}`}
                onClick={handleBackdropClick}
            />
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen && isAnimating ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <FiEye className="h-5 w-5" />
                                View Gallery Item
                            </h2>
                            <p className="text-sm text-gray-600">Gallery details and information</p>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={loading}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        >
                            <FiX className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-cardinal-pink-800"></div>
                                    <p className="mt-2 text-gray-600">Loading gallery details...</p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="p-6">
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                                    <FiAlertTriangle className="h-5 w-5 text-red-500" />
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                                <div className="mt-4 flex justify-center">
                                    <button
                                        onClick={handleClose}
                                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        ) : gallery ? (
                            <div className="p-6 space-y-6">
                                {/* Image Preview */}
                                <div className="relative">
                                    <img
                                        src={gallery.image}
                                        alt={gallery.title}
                                        className="w-full h-64 object-cover rounded-lg border border-gray-200"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement
                                            target.src = "/placeholder.svg?height=256&width=400"
                                        }}
                                    />
                                </div>

                                {/* Title */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Title
                                    </h3>
                                    <p className="text-lg font-medium text-gray-900">{gallery.title}</p>
                                </div>

                                {/* Category and Status */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            Category
                                        </h3>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(gallery.category)}`}>
                                            {gallery.category.charAt(0).toUpperCase() + gallery.category.slice(1)}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            Status
                                        </h3>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(gallery.isActive)}`}>
                                            {gallery.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            Created Date
                                        </h3>
                                        <p className="text-sm text-gray-900">{formatDate(gallery.createdAt)}</p>
                                    </div>
                                    {gallery.updatedAt !== gallery.createdAt && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                                Last Updated
                                            </h3>
                                            <p className="text-sm text-gray-900">{formatDate(gallery.updatedAt)}</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Order
                                    </h3>
                                    <p className="text-sm text-gray-900">{gallery.order}</p>
                                </div>

                                {/* Image URL */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Image URL
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={gallery.image}
                                            readOnly
                                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600 truncate"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard.writeText(gallery.image)
                                                toast.success("Image URL copied to clipboard!")
                                            }}
                                            className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>

                                {/* ID Information */}
                                {/* <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Gallery ID
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded text-gray-600 font-mono truncate">
                                            {gallery._id}
                                        </code>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard.writeText(gallery._id)
                                                toast.success("Gallery ID copied to clipboard!")
                                            }}
                                            className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div> */}
                            </div>
                        ) : null}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>
                        {gallery && (
                            <button
                                type="button"
                                onClick={() => {
                                    window.open(gallery.image, "_blank")
                                }}
                                className="px-6 py-2 bg-cardinal-pink-800 text-white rounded-lg hover:bg-cardinal-pink-900 transition-colors flex items-center gap-2"
                            >
                                <FiEye className="h-4 w-4" />
                                View Full Image
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}