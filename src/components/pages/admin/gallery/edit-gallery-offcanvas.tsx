"use client"
import type React from "react"
import { useState, useEffect } from "react"
import axiosInstance from "@/lib/config/axios"
import { FiX, FiUpload, FiTrash2 } from "react-icons/fi"
import toast from "react-hot-toast"

interface Gallery {
    _id: string
    title: string
    image: string
    order: number
    category: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

interface EditGalleryOffcanvasProps {
    isOpen: boolean
    onClose: () => void
    gallery: Gallery
    onGalleryUpdated?: () => void
}

export function EditGalleryOffcanvas({ isOpen, onClose, gallery, onGalleryUpdated }: EditGalleryOffcanvasProps) {
    const [loading, setLoading] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>(gallery.image)
    const [formData, setFormData] = useState({
        title: gallery.title,
        category: gallery.category,
        isActive: gallery.isActive,
        order: gallery.order.toString(),
    })
    const [errors, setErrors] = useState<any>({})

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true)
            document.body.style.overflow = "hidden"
            // Reset form when gallery changes
            setFormData({
                title: gallery.title,
                category: gallery.category,
                isActive: gallery.isActive,
                order: gallery.order.toString(),
            })
            setImagePreview(gallery.image)
            setImageFile(null)
            setErrors({})
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen, gallery])

    const validateForm = () => {
        const newErrors: any = {}
        if (!formData.title.trim()) newErrors.title = "Title is required"
        return newErrors
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast.error("Only image files are allowed")
                return
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size must be less than 5MB")
                return
            }
            setImageFile(file)
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
            setErrors((prev: any) => ({ ...prev, image: "" }))
        }
    }

    const handleRemoveNewImage = () => {
        setImageFile(null)
        setImagePreview(gallery.image) // Revert to original image
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        const checked = (e.target as HTMLInputElement).checked
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
        setErrors((prev: any) => ({ ...prev, [name]: "", general: "" }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const validationErrors = validateForm()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setLoading(true)
        try {
            const submitFormData = new FormData()
            submitFormData.append("title", formData.title.trim())
            submitFormData.append("category", formData.category)
            submitFormData.append("isActive", formData.isActive.toString())
            submitFormData.append("order", formData.order)
            
            // Always send the current image URL to handle cases where no new image is uploaded
            submitFormData.append("currentImage", gallery.image)
            
            if (imageFile) {
                submitFormData.append("image", imageFile)
            }

            const response = await axiosInstance.put(`/admin/gallery/${gallery._id}`, submitFormData, {
                headers: { "Content-Type": "multipart/form-data" },
            })

            toast.success(response.data.message || "Gallery item updated successfully!")
            onGalleryUpdated?.()
            handleClose()
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || "Failed to update gallery item"
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
                className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen && isAnimating ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Edit Gallery Item</h2>
                            <p className="text-sm text-gray-600">Update gallery image details</p>
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
                                        placeholder="Enter image title"
                                    />
                                    {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className={inputClass("category")}
                                    >
                                        <option value="sports">Sports</option>
                                        <option value="events">Events</option>
                                        <option value="facilities">Facilities</option>
                                        <option value="achievements">Achievements</option>
                                        <option value="training">Training</option>
                                        <option value="other">Other</option>
                                    </select>
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
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                                        Image
                                    </label>
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Current"
                                                className="w-full h-48 object-cover rounded-lg border border-gray-200"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement
                                                    target.src = "/placeholder.svg?height=192&width=400"
                                                }}
                                            />
                                            {imageFile && (
                                                <div className="absolute top-2 right-2 flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveNewImage}
                                                        className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                        title="Remove new image"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center justify-center w-full">
                                            <label
                                                htmlFor="image"
                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <FiUpload className="w-8 h-8 mb-4 text-gray-500" />
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to upload</span> new image
                                                    </p>
                                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                                </div>
                                                <input
                                                    id="image"
                                                    name="image"
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                        </div>

                                        {imageFile && (
                                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                <p className="text-sm text-blue-700">
                                                    <strong>New image selected:</strong> {imageFile.name}
                                                </p>
                                                <p className="text-xs text-blue-600 mt-1">
                                                    The original image will be replaced when you save changes.
                                                </p>
                                            </div>
                                        )}

                                        {!imageFile && (
                                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                                <p className="text-sm text-gray-600">
                                                    <strong>Current image:</strong> {gallery.image.split('/').pop()}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Upload a new image to replace the current one.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

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
                                "Update Gallery"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}