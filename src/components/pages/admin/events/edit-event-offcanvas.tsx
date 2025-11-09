"use client"
import type React from "react"
import { useState, useEffect } from "react"
import axiosInstance from "@/lib/config/axios"
import { FiX, FiUpload, FiTrash2 } from "react-icons/fi"
import toast from "react-hot-toast"
import { Editor } from '@tinymce/tinymce-react';
import { editorConfig } from "./create-event-offcanvas"

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

interface EditEventOffcanvasProps {
    isOpen: boolean
    onClose: () => void
    event: Event
    onEventUpdated?: () => void
}

export function EditEventOffcanvas({ isOpen, onClose, event, onEventUpdated }: EditEventOffcanvasProps) {
    const [loading, setLoading] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const [bannerFile, setBannerFile] = useState<File | null>(null)
    const [bannerPreview, setBannerPreview] = useState<string>(event.bannerImage || "")
    const [removeBanner, setRemoveBanner] = useState(false)
    const [eventImagesFiles, setEventImagesFiles] = useState<File[]>([])
    const [removeEventImages, setRemoveEventImages] = useState(false)
    const [formData, setFormData] = useState({
        title: event.title,
        description: event.description,
        slug: event.slug,
        content: event.content,
        date: event.date || "",
        location: event.location || "",
        isActive: event.isActive,
        isPastEvent: event.isPastEvent,
        order: event.order?.toString() || "",
    })
    const [errors, setErrors] = useState<any>({})

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true)
            document.body.style.overflow = "hidden"
            // Reset form when event changes
            setFormData({
                title: event.title,
                description: event.description,
                slug: event.slug,
                content: event.content,
                date: event.date || "",
                location: event.location || "",
                isActive: event.isActive,
                isPastEvent: event.isPastEvent,
                order: event.order?.toString() || "",
            })
            setBannerPreview(event.bannerImage || "")
            setBannerFile(null)
            setRemoveBanner(false)
            setEventImagesFiles([])
            setRemoveEventImages(false)
            setErrors({})
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen, event])

    const validateForm = () => {
        const newErrors: any = {}
        if (!formData.title.trim()) newErrors.title = "Title is required"
        if (!formData.description.trim()) newErrors.description = "Description is required"
        if (!formData.content.trim()) newErrors.content = "Content is required"
        if (!formData.slug.trim()) newErrors.slug = "Slug is required"

        return newErrors
    }

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast.error("Only image files are allowed for banner")
                return
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Banner size must be less than 5MB")
                return
            }
            setBannerFile(file)
            setRemoveBanner(false)
            const reader = new FileReader()
            reader.onload = (e) => {
                setBannerPreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
            setErrors((prev: any) => ({ ...prev, banner: "" }))
        }
    }

    const handleRemoveNewBanner = () => {
        setBannerFile(null)
        setBannerPreview(event.bannerImage || "")
    }

    const handleRemoveBanner = () => {
        setBannerFile(null)
        setRemoveBanner(true)
        setBannerPreview("")
    }

    const handleEventImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        const validFiles: File[] = []

        files.forEach((file) => {
            if (!file.type.startsWith("image/")) {
                toast.error(`${file.name} is not an image file`)
                return
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} exceeds 5MB limit`)
                return
            }
            validFiles.push(file)
        })

        setEventImagesFiles(validFiles)
        setRemoveEventImages(false)
    }

    const handleRemoveEventImages = () => {
        setEventImagesFiles([])
        setRemoveEventImages(true)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        const checked = (e.target as HTMLInputElement).checked

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
        setErrors((prev: any) => ({ ...prev, [name]: "", general: "" }))
    }

    const handleEditorChange = (content: string) => {
        setFormData((prev) => ({
            ...prev,
            content: content
        }))
        setErrors((prev: any) => ({ ...prev, content: "" }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const validationErrors = validateForm()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            toast.error("Please fix all validation errors")
            return
        }

        setLoading(true)
        try {
            const submitFormData = new FormData()
            submitFormData.append("title", formData.title.trim())
            submitFormData.append("description", formData.description.trim())
            submitFormData.append("content", formData.content.trim())
            submitFormData.append("slug", formData.slug.trim())
            submitFormData.append("isActive", formData.isActive.toString())
            submitFormData.append("isPastEvent", formData.isPastEvent.toString())
            submitFormData.append("order", formData.order)

            // Optional fields
            if (formData.date) submitFormData.append("date", formData.date.trim())
            if (formData.location) submitFormData.append("location", formData.location.trim())

            // Handle banner
            if (removeBanner) {
                submitFormData.append("removeBannerImage", "true")
            } else if (bannerFile) {
                submitFormData.append("bannerImage", bannerFile)
            } else if (event.bannerImage) {
                submitFormData.append("currentBannerImage", event.bannerImage)
            }

            // Handle event images
            if (removeEventImages) {
                submitFormData.append("removeEventImages", "true")
            } else if (eventImagesFiles.length > 0) {
                eventImagesFiles.forEach((file) => {
                    submitFormData.append("eventImages", file)
                })
            } else if (event.eventImages && event.eventImages.length > 0) {
                submitFormData.append("currentEventImages", JSON.stringify(event.eventImages))
            }

            const response = await axiosInstance.put(`/admin/events/${event._id}`, submitFormData, {
                headers: { "Content-Type": "multipart/form-data" },
            })

            toast.success(response.data.message || "Event updated successfully!")
            onEventUpdated?.()
            handleClose()
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || "Failed to update event"
            toast.error(errorMessage)
            setErrors({ general: errorMessage })
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

    const inputClass = (field: string) =>
        `w-full px-3 py-2 border ${errors[field] ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 outline-none focus:ring-cardinal-pink-800 focus:border-cardinal-pink-800 transition-colors`

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
                            <h2 className="text-xl font-bold text-gray-900">Edit Event</h2>
                            <p className="text-sm text-gray-600">Update event details</p>
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
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-6">
                                {errors.general && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-600">{errors.general}</p>
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className={inputClass("title")}
                                        placeholder="Enter event title"
                                    />
                                    {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                                        Slug <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="slug"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        className={inputClass("slug")}
                                        placeholder="event-url-slug"
                                    />
                                    {errors.slug && <p className="text-sm text-red-500 mt-1">{errors.slug}</p>}
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className={inputClass("description")}
                                        placeholder="Enter event description"
                                    />
                                    {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                                </div>

                                <div>
                                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                        Content <span className="text-red-500">*</span>
                                    </label>
                                    <Editor
                                        apiKey={process.env.REACT_APP_TINYMCE_API_KEY || "9rfldgcdc9dmma091ep27vm5qlyb0n4qgm80qm8kelo9s860"}
                                        init={editorConfig}
                                        value={formData.content}
                                        onEditorChange={handleEditorChange}
                                    />
                                    {errors.content && <p className="text-sm text-red-500 mt-1">{errors.content}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                                            Event Date
                                        </label>
                                        <input
                                            type="text"
                                            id="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            className={inputClass("date")}
                                            placeholder="e.g., March 15, 2025"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            className={inputClass("location")}
                                            placeholder="Enter event location"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                                        Order
                                    </label>
                                    <input
                                        type="number"
                                        id="order"
                                        name="order"
                                        value={formData.order}
                                        onChange={handleChange}
                                        className={inputClass("order")}
                                        placeholder="Enter order number"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-700 mb-2">
                                        Banner Image
                                    </label>
                                    <div className="space-y-4">
                                        {bannerPreview && !removeBanner && (
                                            <div className="relative">
                                                <img
                                                    src={bannerPreview}
                                                    alt="Current"
                                                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement
                                                        target.src = "/placeholder.svg?height=192&width=400"
                                                    }}
                                                />
                                                {bannerFile && (
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveNewBanner}
                                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                        title="Remove new banner"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {event.bannerImage && !removeBanner && !bannerFile && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveBanner}
                                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                                            >
                                                Remove Banner
                                            </button>
                                        )}

                                        {removeBanner && (
                                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                <p className="text-sm text-yellow-700">
                                                    Banner will be removed when you save changes.
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setRemoveBanner(false)
                                                        setBannerPreview(event.bannerImage || "")
                                                    }}
                                                    className="text-sm text-yellow-800 hover:text-yellow-900 font-medium mt-1"
                                                >
                                                    Undo
                                                </button>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-center w-full">
                                            <label
                                                htmlFor="bannerImage"
                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <FiUpload className="w-8 h-8 mb-4 text-gray-500" />
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to upload</span> new banner
                                                    </p>
                                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                                </div>
                                                <input
                                                    id="bannerImage"
                                                    name="bannerImage"
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleBannerChange}
                                                />
                                            </label>
                                        </div>

                                        {bannerFile && (
                                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <p className="text-sm text-blue-700">
                                                    <strong>New banner selected:</strong> {bannerFile.name}
                                                </p>
                                                <p className="text-xs text-blue-600 mt-1">
                                                    The original banner will be replaced when you save changes.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="eventImages" className="block text-sm font-medium text-gray-700 mb-2">
                                        Event Images
                                    </label>
                                    <div className="space-y-4">
                                        {event.eventImages && event.eventImages.length > 0 && !removeEventImages && eventImagesFiles.length === 0 && (
                                            <div className="space-y-2">
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
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveEventImages}
                                                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                                                >
                                                    Remove All Event Images
                                                </button>
                                            </div>
                                        )}

                                        {removeEventImages && (
                                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                <p className="text-sm text-yellow-700">
                                                    All event images will be removed when you save changes.
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => setRemoveEventImages(false)}
                                                    className="text-sm text-yellow-800 hover:text-yellow-900 font-medium mt-1"
                                                >
                                                    Undo
                                                </button>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-center w-full">
                                            <label
                                                htmlFor="eventImages"
                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <FiUpload className="w-8 h-8 mb-4 text-gray-500" />
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to upload</span> new event images
                                                    </p>
                                                    <p className="text-xs text-gray-500">Multiple images, PNG, JPG up to 5MB each</p>
                                                </div>
                                                <input
                                                    id="eventImages"
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleEventImagesChange}
                                                />
                                            </label>
                                        </div>

                                        {eventImagesFiles.length > 0 && (
                                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <p className="text-sm text-blue-700">
                                                    <strong>New event images selected:</strong> {eventImagesFiles.length} file(s)
                                                </p>
                                                <p className="text-xs text-blue-600 mt-1">
                                                    The original event images will be replaced when you save changes.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-cardinal-pink-800 focus:ring-cardinal-pink-800 border-gray-300 rounded"
                                        />
                                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                                            Active (visible to users)
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="isPastEvent"
                                            name="isPastEvent"
                                            checked={formData.isPastEvent}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-cardinal-pink-800 focus:ring-cardinal-pink-800 border-gray-300 rounded"
                                        />
                                        <label htmlFor="isPastEvent" className="ml-2 block text-sm text-gray-900">
                                            Past Event
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-6 py-2 bg-cardinal-pink-800 text-white rounded-lg hover:bg-cardinal-pink-900 disabled:opacity-50 transition-colors flex items-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                "Update Event"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}