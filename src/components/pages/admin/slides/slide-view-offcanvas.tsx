"use client"
import type React from "react"
import { useState, useEffect } from "react"
import axiosInstance from "@/lib/config/axios"
import { FiAlertTriangle, FiEye, FiX, FiFilm } from "react-icons/fi"
import toast from "react-hot-toast"

interface Slide {
    _id: string
    title: string
    description: string
    content: string
    video?: string
    thumbnail: string
    slug: string
    order: number
    buttons?: Array<{
        text: string
        link: string
    }>
    isActive: boolean
    createdAt: string
    updatedAt: string
}

interface SlideViewOffcanvasProps {
    isOpen: boolean
    onClose: () => void
    slideId: string
}

export function SlideViewOffcanvas({ isOpen, onClose, slideId }: SlideViewOffcanvasProps) {
    const [loading, setLoading] = useState(true)
    const [isAnimating, setIsAnimating] = useState(false)
    const [slide, setSlide] = useState<Slide | null>(null)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true)
            document.body.style.overflow = "hidden"
            fetchSlide()
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen, slideId])

    const fetchSlide = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(`/admin/slides/${slideId}`)
            setSlide(response.data.slide)
            setError("")
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || "Failed to load slide"
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
                className={`fixed top-0 right-0 h-full w-full max-w-5xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen && isAnimating ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <FiEye className="h-5 w-5" />
                                View Slide
                            </h2>
                            <p className="text-sm text-gray-600">Slide details and information</p>
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
                                    <p className="mt-2 text-gray-600">Loading slide details...</p>
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
                        ) : slide ? (
                            <div className="p-6 space-y-6">
                                {/* Thumbnail Preview */}
                                <div className="relative">
                                    <img
                                        src={slide.thumbnail}
                                        alt={slide.title}
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
                                    <p className="text-lg font-medium text-gray-900">{slide.title}</p>
                                </div>

                                {/* Slug */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Slug
                                    </h3>
                                    <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded border border-gray-200">{slide.slug}</p>
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Description
                                    </h3>
                                    <p className="text-sm text-gray-900">{slide.description}</p>
                                </div>

                                {/* Content */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Content
                                    </h3>
                                    <div className="text-sm text-gray-900" dangerouslySetInnerHTML={{ __html: slide.content }} />
                                </div>

                                {/* Buttons */}
                                {slide.buttons && slide.buttons.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            Action Buttons
                                        </h3>
                                        <div className="space-y-2">
                                            {slide.buttons.map((button, index) => (
                                                <div key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-gray-900">{button.text}</span>
                                                        <a
                                                            href={button.link}
                                                            target={button.link.startsWith('http') ? '_blank' : undefined}
                                                            rel={button.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                            className="text-xs text-cardinal-pink-800 hover:text-cardinal-pink-900 underline"
                                                        >
                                                            {button.link}
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Order and Status */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            Order
                                        </h3>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-100 text-gray-800 border-gray-200">
                                            {slide.order}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            Status
                                        </h3>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(slide.isActive)}`}>
                                            {slide.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>

                                {/* Video */}
                                {slide.video && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            Video
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <FiFilm className="h-4 w-4 text-gray-500" />
                                            <p className="text-sm text-gray-900 truncate flex-1">{slide.video.split('/').pop()}</p>
                                            <a
                                                href={slide.video}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-cardinal-pink-800 hover:text-cardinal-pink-900 font-medium"
                                            >
                                                View Video
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Dates */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            Created Date
                                        </h3>
                                        <p className="text-sm text-gray-900">{formatDate(slide.createdAt)}</p>
                                    </div>
                                    {slide.updatedAt !== slide.createdAt && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                                Last Updated
                                            </h3>
                                            <p className="text-sm text-gray-900">{formatDate(slide.updatedAt)}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnail URL */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Thumbnail URL
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={slide.thumbnail}
                                            readOnly
                                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600 truncate"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard.writeText(slide.thumbnail)
                                                toast.success("Thumbnail URL copied to clipboard!")
                                            }}
                                            className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
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
                        {slide && (
                            <button
                                type="button"
                                onClick={() => {
                                    window.open(slide.thumbnail, "_blank")
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