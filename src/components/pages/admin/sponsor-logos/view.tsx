// components/logo-view-offcanvas.tsx
"use client"

import { useState, useEffect } from "react"
import { FiX, FiExternalLink, FiImage, FiCalendar } from "react-icons/fi"
import axiosInstance from "@/lib/config/axios"

interface LogoViewOffcanvasProps {
    isOpen: boolean
    onClose: () => void
    logoId: string | null
}

type SponsorLogo = {
    _id: string
    name: string
    logo_url: string
    website: string
    description: string
    type: 'partner' | 'sponsor'
    status: 'active' | 'inactive'
    order: number
    createdAt: string
    updatedAt: string
}

export default function LogoViewOffcanvas({ isOpen, onClose, logoId }: LogoViewOffcanvasProps) {
    const [logo, setLogo] = useState<SponsorLogo | null>(null)
    const [loading, setLoading] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true)
            document.body.style.overflow = "hidden"
            if (logoId) {
                loadLogo()
            }
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen, logoId])

    const loadLogo = async () => {
        if (!logoId) return
        try {
            setLoading(true)
            const res = await axiosInstance.get(`/admin/sponsor-logos/${logoId}`)
            setLogo(res.data.data)
        } catch (error: any) {
            console.error("Failed to load logo:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setIsAnimating(false)
        setTimeout(() => {
            setLogo(null)
            onClose()
        }, 300)
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) handleClose()
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
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
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Logo Details</h2>
                            <p className="text-sm text-gray-600">View sponsor logo information</p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <FiX className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {loading ? (
                            <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cardinal-pink-800"></div>
                            </div>
                        ) : logo ? (
                            <div className="space-y-6">
                                {/* Logo Preview */}
                                <div className="flex justify-center">
                                    <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                        {logo.logo_url ? (
                                            <img
                                                src={logo.logo_url}
                                                alt={logo.name}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <FiImage className="h-16 w-16 text-gray-400" />
                                        )}
                                    </div>
                                </div>

                                {/* Basic Info */}
                                <div className="grid gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <p className="text-gray-900 font-medium">{logo.name}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                        {logo.website ? (
                                            <a
                                                href={logo.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-cardinal-pink-800 hover:text-cardinal-pink-900 flex items-center gap-1"
                                            >
                                                {logo.website}
                                                <FiExternalLink className="h-3 w-3" />
                                            </a>
                                        ) : (
                                            <p className="text-gray-500">No website provided</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <p className="text-gray-900">{logo.description || "No description provided"}</p>
                                    </div>
                                </div>

                                {/* Metadata */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${logo.type === 'sponsor' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {logo.type}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${logo.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {logo.status}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Order</label>
                                        <p className="text-sm text-gray-900">{logo.order}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Created</label>
                                        <div className="flex items-center gap-1 text-sm text-gray-900">
                                            <FiCalendar className="h-3 w-3" />
                                            {formatDate(logo.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <FiImage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-1">Logo not found</h3>
                                <p className="text-gray-500">The requested logo could not be loaded.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
                        <button
                            onClick={handleClose}
                            className="px-6 py-2 bg-cardinal-pink-800 text-white rounded-lg hover:bg-cardinal-pink-900 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}