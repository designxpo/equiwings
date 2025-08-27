"use client"
import axiosInstance from "@/lib/config/axios"
import { Loader } from "@/utils/loaders"
import { useState, useEffect } from "react"
import { LuX, LuCalendar, LuEye, LuMegaphone, LuImage, LuCheck, LuX as LuXCircle } from "react-icons/lu"

interface Announcement {
    _id: string
    title: string
    description: string
    image: string
    readMoreButton: string
    isActive: boolean
    slug: string
    createdAt: string
    updatedAt: string
}

interface AnnouncementViewOffcanvasProps {
    isOpen: boolean
    onClose: () => void
    announcementId: string
}

export default function AnnouncementViewOffcanvas({ isOpen, onClose, announcementId }: AnnouncementViewOffcanvasProps) {
    const [announcement, setAnnouncement] = useState<Announcement | null>(null)
    const [loading, setLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (isOpen && announcementId) {
            setIsVisible(true)
            fetchAnnouncement()
        } else if (!isOpen) {
            setIsVisible(false)
        }
    }, [isOpen, announcementId])

    const fetchAnnouncement = async () => {
        try {
            setLoading(true)
            const response = await axiosInstance.get(`/admin/announcements/${announcementId}`)
            setAnnouncement(response.data.announcement)
        } catch (error: any) {
            console.log(error.response?.data?.error || "Failed to fetch announcement")
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setIsVisible(false)
        setTimeout(() => {
            setAnnouncement(null)
            onClose()
        }, 300)
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
                className={`absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isVisible ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="bg-white px-6 py-4 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <div className="text-black">
                                <h2 className="text-2xl font-bold">Announcement Details</h2>
                                <p className="text-gray-600 mt-1">View announcement information</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="rounded-full p-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200"
                            >
                                <LuX className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto bg-gray-50">
                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="p-6">
                                {announcement && (
                                    <div className="space-y-6">
                                        {/* Header Info */}
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{announcement.title}</h3>
                                                    <div className="flex items-center space-x-4 mb-3">
                                                        <span
                                                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${announcement.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                                }`}
                                                        >
                                                            {announcement.isActive ? (
                                                                <LuCheck className="h-4 w-4 mr-1" />
                                                            ) : (
                                                                <LuXCircle className="h-4 w-4 mr-1" />
                                                            )}
                                                            {announcement.isActive ? "Active" : "Inactive"}
                                                        </span>
                                                        <span className="text-sm text-gray-500">Slug: {announcement.slug}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Image Section */}
                                        {announcement.image && announcement.image !== "dummy link" && (
                                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                    <LuImage className="h-5 w-5 mr-2 text-blue-600" />
                                                    Featured Image
                                                </h4>
                                                <div className="rounded-lg overflow-hidden border border-gray-200">
                                                    <img
                                                        src={announcement.image || "/placeholder.svg"}
                                                        alt={announcement.title}
                                                        className="w-full h-64 object-cover"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Description */}
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                <LuMegaphone className="h-5 w-5 mr-2 text-blue-600" />
                                                Description
                                            </h4>
                                            <div className="prose max-w-none">
                                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{announcement.description}</p>
                                            </div>
                                        </div>

                                        {/* Read More */}
                                        {announcement.readMoreButton && (
                                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                    <LuEye className="h-5 w-5 mr-2 text-blue-600" />
                                                    Read More Content
                                                </h4>
                                                <div className="prose max-w-none">
                                                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                        {announcement.readMoreButton}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Timestamps */}
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                <LuCalendar className="h-5 w-5 mr-2 text-blue-600" />
                                                Timeline
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm text-gray-500">Created</p>
                                                            <p className="text-lg font-semibold text-gray-900">
                                                                {formatDate(announcement.createdAt)}
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
                                                                {formatDate(announcement.updatedAt)}
                                                            </p>
                                                        </div>
                                                        <LuCalendar className="h-8 w-8 text-green-500" />
                                                    </div>
                                                </div>
                                            </div>
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
