"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axiosInstance from "@/lib/config/axios"
import { FiX, FiUpload, FiImage, FiExternalLink } from "react-icons/fi"
import toast from "react-hot-toast"

interface CreateLogoOffcanvasProps {
    isOpen: boolean
    onClose: () => void
    onLogoCreated?: () => void
}

export default function CreateLogoOffcanvas({ isOpen, onClose, onLogoCreated }: CreateLogoOffcanvasProps) {
    const [loading, setLoading] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        website: "",
        description: "",
        type: "sponsor" as "partner" | "sponsor",
        status: "active" as "active" | "inactive",
        order: 0,
    })

    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string>("")
    const [errors, setErrors] = useState<any>({})

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true)
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    const validateForm = () => {
        const newErrors: any = {}
        if (!formData.name.trim()) newErrors.name = "Name is required"
        if (!logoFile) newErrors.logo = "Logo image is required"
        return newErrors
    }

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            setLogoFile(file)
            const reader = new FileReader()
            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
            setErrors((prev: any) => ({ ...prev, logo: "" }))
        }
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
            submitFormData.append("name", formData.name.trim())
            submitFormData.append("website", formData.website.trim())
            submitFormData.append("description", formData.description.trim())
            submitFormData.append("type", formData.type)
            submitFormData.append("status", formData.status)
            submitFormData.append("order", formData.order.toString())

            if (logoFile) {
                submitFormData.append("logo_url", logoFile)
            }

            const response = await axiosInstance.post("/admin/sponsor-logos", submitFormData, {
                headers: { "Content-Type": "multipart/form-data" },
            })

            toast.success(response.data.message || "Logo created successfully!")
            resetForm()
            onLogoCreated?.()
            handleClose()
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to create logo")
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            name: "",
            website: "",
            description: "",
            type: "partner",
            status: "active",
            order: 0,
        })
        setLogoFile(null)
        setLogoPreview("")
        setErrors({})
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }))
        setErrors((prev: any) => ({ ...prev, [name]: "" }))
    }

    const handleClose = () => {
        if (!loading) {
            setIsAnimating(false)
            setTimeout(() => {
                resetForm()
                onClose()
            }, 300)
        }
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) handleClose()
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
                            <h2 className="text-xl font-bold text-gray-900">Add Sponsor Logo</h2>
                            <p className="text-sm text-gray-600">Upload a new logo</p>
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
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Logo Type */}
                            {/* <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {(["partner", "sponsor"] as const).map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, type }))}
                                            className={`p-4 border-2 rounded-lg transition-all ${formData.type === type
                                                ? 'border-cardinal-pink-800 bg-cardinal-pink-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            {type === "sponsor" ? (
                                                <FiExternalLink className={`h-6 w-6 mx-auto mb-2 ${formData.type === type ? 'text-cardinal-pink-800' : 'text-gray-400'}`} />
                                            ) : (
                                                <FiImage className={`h-6 w-6 mx-auto mb-2 ${formData.type === type ? 'text-cardinal-pink-800' : 'text-gray-400'}`} />
                                            )}
                                            <div className={`font-medium capitalize ${formData.type === type ? 'text-cardinal-pink-800' : 'text-gray-700'}`}>
                                                {type}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div> */}

                            {/* Basic Fields */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={inputClass("name")}
                                    placeholder="Enter logo name"
                                />
                                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    id="website"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className={inputClass("website")}
                                    placeholder="https://example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={inputClass("description")}
                                    placeholder="Enter description"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
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
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className={inputClass("status")}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            {/* Logo Upload */}
                            <div>
                                <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                                    Logo <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-center w-full">
                                        <label
                                            htmlFor="logo"
                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <FiUpload className="w-8 h-8 mb-4 text-gray-500" />
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span> logo
                                                </p>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                            </div>
                                            <input
                                                id="logo"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleLogoChange}
                                            />
                                        </label>
                                    </div>
                                    {errors.logo && <p className="text-sm text-red-500">{errors.logo}</p>}
                                    {logoPreview && (
                                        <div className="relative">
                                            <img
                                                src={logoPreview || "/placeholder.svg"}
                                                alt="Preview"
                                                className="w-32 h-32 object-contain rounded-lg mx-auto"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setLogoFile(null)
                                                    setLogoPreview("")
                                                }}
                                                className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 -translate-y-1/2 translate-x-1/2"
                                            >
                                                <FiX className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
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
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating...
                                </>
                            ) : (
                                "Create Logo"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}