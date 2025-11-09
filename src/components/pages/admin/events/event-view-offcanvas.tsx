"use client"
import type React from "react"
import { useState, useEffect } from "react"
import axiosInstance from "@/lib/config/axios"
import { FiAlertTriangle, FiEye, FiX, FiCalendar, FiMapPin, FiImage } from "react-icons/fi"
import toast from "react-hot-toast"

interface Event {
    _id: string
    title: string
    description: string
    slug: string
    content: string
    bannerImage?: string
    date?: string
    location?: string
    isPastEvent: boolean
    eventImages?: string[]
    order?: number
    isActive: boolean
    createdAt: string
    updatedAt: string
}

interface EventViewOffcanvasProps {
    isOpen: boolean
    onClose: () => void
    eventId: string
}

export function EventViewOffcanvas({ isOpen, onClose, eventId }: EventViewOffcanvasProps) {
    const [loading, setLoading] = useState(true)
    const [isAnimating, setIsAnimating] = useState(false)
    const [event, setEvent] = useState<Event | null>(null)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true)
            document.body.style.overflow = "hidden"
            fetchEvent()
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen, eventId])

    const fetchEvent = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(`/admin/events/${eventId}`)
            setEvent(response.data.event)
            setError("")
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || "Failed to load event"
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

    const getEventTypeBadge = (isPast: boolean) => {
        return isPast
            ? "bg-gray-100 text-gray-800 border-gray-200"
            : "bg-blue-100 text-blue-800 border-blue-200"
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
                                View Event
                            </h2>
                            <p className="text-sm text-gray-600">Event details and information</p>
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
                                    <p className="mt-2 text-gray-600">Loading event details...</p>
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
                        ) : event ? (
                            <div className="p-6 space-y-6">
                                {/* Banner Preview */}
                                {event.bannerImage && (
                                    <div className="relative">
                                        <img
                                            src={event.bannerImage}
                                            alt={event.title}
                                            className="w-full h-64 object-cover rounded-lg border border-gray-200"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement
                                                target.src = "/placeholder.svg?height=256&width=400"
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Title */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Title
                                    </h3>
                                    <p className="text-lg font-medium text-gray-900">{event.title}</p>
                                </div>

                                {/* Slug */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Slug
                                    </h3>
                                    <p className="text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded border border-gray-200">{event.slug}</p>
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Description
                                    </h3>
                                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{event.description}</p>
                                </div>

                                {/* Content */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        Content
                                    </h3>
                                    <div 
                                        className="text-sm text-gray-900 prose prose-sm max-w-none bg-gray-50 px-4 py-3 rounded border border-gray-200"
                                        dangerouslySetInnerHTML={{ __html: event.content }}
                                    />
                                </div>

                                {/* Event Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {event.date && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <FiCalendar className="h-4 w-4" />
                                                Date
                                            </h3>
                                            <p className="text-sm text-gray-900">{event.date}</p>
                                        </div>
                                    )}

                                    {event.location && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <FiMapPin className="h-4 w-4" />
                                                Location
                                            </h3>
                                            <p className="text-sm text-gray-900">{event.location}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Event Images */}
                                {event.eventImages && event.eventImages.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <FiImage className="h-4 w-4" />
                                            Event Images
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {event.eventImages.map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={img}
                                                    alt={`Event ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement
                                                        target.src = "/placeholder.svg"
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Order and Status */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            Order
                                        </h3>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-100 text-gray-800 border-gray-200">
                                            {event.order || 0}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            Status
                                        </h3>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(event.isActive)}`}>
                                            {event.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            Type
                                        </h3>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getEventTypeBadge(event.isPastEvent)}`}>
                                            {event.isPastEvent ? "Past" : "Upcoming"}
                                        </span>
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            Created Date
                                        </h3>
                                        <p className="text-sm text-gray-900">{formatDate(event.createdAt)}</p>
                                    </div>
                                    {event.updatedAt !== event.createdAt && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                                Last Updated
                                            </h3>
                                            <p className="text-sm text-gray-900">{formatDate(event.updatedAt)}</p>
                                        </div>
                                    )}
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
                        {event && event.bannerImage && (
                            <button
                                type="button"
                                onClick={() => {
                                    window.open(event.bannerImage, "_blank")
                                }}
                                className="px-6 py-2 bg-cardinal-pink-800 text-white rounded-lg hover:bg-cardinal-pink-900 transition-colors flex items-center gap-2"
                            >
                                <FiEye className="h-4 w-4" />
                                View Full Banner
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}