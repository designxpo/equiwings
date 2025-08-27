"use client"

import Image from "next/image"
import { useEffect } from "react"
import {
    FiX,
    FiFileText,
    FiCalendar,
    FiUser,
    FiClock,
    FiTag,
    FiEye,
    FiEyeOff,
    FiEdit,
    FiSearch,
    FiLink,
    FiHash,
} from "react-icons/fi"

type Blog = {
    _id: string
    title: string
    slug: string
    content: string
    featuredImage?: string
    author: {
        _id: string
        firstName: string
        lastName: string
        email: string
    }
    category: string
    status: "draft" | "published"
    publishedAt?: string
    // SEO Fields
    metaTitle?: string
    metaDescription?: string
    metaKeywords?: string
    createdAt: string
    updatedAt: string
}

interface ViewBlogOffcanvasProps {
    isOpen: boolean
    onClose: () => void
    blog: Blog | null
}

export default function ViewBlogOffcanvas({ isOpen, onClose, blog }: ViewBlogOffcanvasProps) {
    const displayBlog = blog

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset"
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case "technology":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "lifestyle":
                return "bg-green-100 text-green-800 border-green-200"
            case "business":
                return "bg-purple-100 text-purple-800 border-purple-200"
            case "health":
                return "bg-orange-100 text-orange-800 border-orange-200"
            case "travel":
                return "bg-pink-100 text-pink-800 border-pink-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getReadingTime = (content: string) => {
        const wordsPerMinute = 200
        const wordCount = content.split(/\s+/).length
        const readingTime = Math.ceil(wordCount / wordsPerMinute)
        return `${readingTime} min read`
    }

    if (!isOpen || !displayBlog) return null

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300" onClick={onClose} />
            {/* Offcanvas */}
            <div className="fixed top-0 right-0 h-full w-full max-w-4xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-cardinal-pink-950 rounded-lg">
                                <FiFileText className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Blog Details</h2>
                                <p className="text-sm text-gray-500">Complete blog information with SEO details</p>
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
                        {/* Blog Hero */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="space-y-6">
                                {/* Featured Image */}
                                {displayBlog.featuredImage && (
                                    <div className="aspect-video bg-white rounded-lg overflow-hidden border border-gray-200">
                                        <Image
                                            src={displayBlog.featuredImage || "/placeholder.svg"}
                                            alt={displayBlog.title}
                                            width={800}
                                            height={400}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* Blog Info */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{displayBlog.title}</h3>
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <span
                                                className={`px-3 py-1 text-sm font-medium rounded-full border ${getCategoryColor(displayBlog.category)}`}
                                            >
                                                {displayBlog.category}
                                            </span>
                                            <span
                                                className={`px-3 py-1 text-sm font-medium rounded-full border ${displayBlog.status === "published"
                                                    ? "bg-green-100 text-green-800 border-green-200"
                                                    : "bg-yellow-100 text-yellow-800 border-yellow-200"
                                                    }`}
                                            >
                                                {displayBlog.status}
                                            </span>
                                            <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full border border-gray-200">
                                                {getReadingTime(displayBlog.content)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Author & Meta Info */}
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-cardinal-pink-950 rounded-full flex items-center justify-center">
                                                    <FiUser className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {displayBlog.author.firstName} {displayBlog.author.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{displayBlog.author.email}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {displayBlog.publishedAt ? formatDate(displayBlog.publishedAt) : "Not published"}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {displayBlog.status === "published" ? "Published" : "Draft"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SEO Information */}
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                            <div className="flex items-center space-x-2 mb-4">
                                <FiSearch className="h-5 w-5 text-cardinal-pink-950" />
                                <h4 className="font-semibold text-gray-900">SEO Information</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                                        <div className="p-3 bg-gray-50 rounded-lg border">
                                            <p className="text-sm text-gray-900">{displayBlog.metaTitle || displayBlog.title || "Not set"}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {(displayBlog.metaTitle || displayBlog.title || "").length}/60 characters
                                            </p>
                                        </div>

                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                            <div className="p-3 bg-gray-50 rounded-lg border">
                                                <p className="text-sm text-gray-900">{displayBlog.slug}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                                        <div className="p-3 bg-gray-50 rounded-lg border">
                                            <p className="text-sm text-gray-900">{displayBlog.metaDescription || "Not set"}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {(displayBlog.metaDescription || "").length}/160 characters
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
                                        <div className="p-3 bg-gray-50 rounded-lg border">
                                            <p className="text-sm text-gray-900">{displayBlog.metaKeywords || "Not set"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                            <div className="flex items-center space-x-2 mb-4">
                                <FiEdit className="h-5 w-5 text-cardinal-pink-950" />
                                <h4 className="font-semibold text-gray-900">Content</h4>
                            </div>
                            <div className="prose max-w-none">
                                <div
                                    className="text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: displayBlog.content || "" }}
                                />
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Technical Details */}
                            <div className="bg-white rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center space-x-2 mb-4">
                                    <FiTag className="h-5 w-5 text-cardinal-pink-950" />
                                    <h4 className="font-semibold text-gray-900">Details</h4>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Category</span>
                                        <span className="text-sm font-medium text-gray-900">{displayBlog.category}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Words</span>
                                        <span className="text-sm font-medium text-gray-900">{displayBlog.content.split(/\s+/).length}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="bg-white rounded-lg p-5 border border-gray-200">
                                <div className="flex items-center space-x-2 mb-4">
                                    <FiEye className="h-5 w-5 text-cardinal-pink-950" />
                                    <h4 className="font-semibold text-gray-900">Status</h4>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">Visibility</span>
                                        {displayBlog.status === "published" ? (
                                            <FiEye className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <FiEyeOff className="h-4 w-4 text-yellow-500" />
                                        )}
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <FiClock className="h-4 w-4 text-gray-500" />
                                            <span className="text-xs text-gray-600">
                                                {displayBlog.status === "published"
                                                    ? `Published ${displayBlog.publishedAt ? formatDate(displayBlog.publishedAt) : ""}`
                                                    : "Currently in draft mode"}
                                            </span>
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
                                        <span className="text-sm font-medium text-gray-900">{formatDate(displayBlog.createdAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Updated</span>
                                        <span className="text-sm font-medium text-gray-900">{formatDate(displayBlog.updatedAt)}</span>
                                    </div>
                                    {displayBlog.publishedAt && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Published</span>
                                            <span className="text-sm font-medium text-gray-900">{formatDate(displayBlog.publishedAt)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 p-6 bg-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>ID: {displayBlog._id.slice(-8)}</span>
                                <span>Status: {displayBlog.status}</span>
                                <span>Category: {displayBlog.category}</span>
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
