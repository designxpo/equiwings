"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FiX } from "react-icons/fi"
import axiosInstance from "@/lib/config/axios"
import toast from "react-hot-toast"

// User type definition
type User = {
    _id: string
    firstName: string
    lastName: string
    email: string
    countryCode: string
    phoneNumber: string
    role: {
        _id: string
        name: string
        description: string
    }
    isEmailVerified: boolean
    createdAt: string
    updatedAt: string
}

interface EditUserOffcanvasProps {
    isOpen: boolean
    onClose: () => void
    onUserUpdated?: () => void
    user: User | null
}

export default function EditUserOffcanvas({ isOpen, onClose, onUserUpdated, user }: EditUserOffcanvasProps) {
    const [loading, setLoading] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        countryCode: "+1",
        password: "",
    })

    const [errors, setErrors] = useState<Partial<typeof formData>>({})

    // Handle smooth transitions
    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true)
            // Prevent body scroll when offcanvas is open
            document.body.style.overflow = 'hidden'
        } else {
            // Restore body scroll when offcanvas is closed
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    // Populate form data when user prop changes
    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                countryCode: user.countryCode || "+1",
                password: "", // Always empty for security
            })
            setErrors({})
        }
    }, [isOpen, user])

    const validateForm = () => {
        const newErrors: Partial<typeof formData> = {}

        if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
        if (!formData.email.trim()) newErrors.email = "Email is required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format"

        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required"
        else if (!/^[0-9]{6,15}$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Invalid phone number"

        // Password is optional for updates
        if (formData.password && formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }

        return newErrors
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        const validationErrors = validateForm()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setLoading(true)
        try {
            // Create payload without password if it's empty
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                countryCode: formData.countryCode,
                ...(formData.password && { password: formData.password }),
            }

            await axiosInstance.put(`/admin/users/${user._id}`, payload)
            toast.success('User updated successfully!')

            // Call callback and close offcanvas
            onUserUpdated?.()
            handleClose()
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to update user")
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setErrors(prev => ({ ...prev, [name]: "" }))
    }

    const handleClose = () => {
        if (!loading) {
            setIsAnimating(false)
            // Delay the actual close to allow exit animation
            setTimeout(() => {
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phoneNumber: "",
                    countryCode: "+1",
                    password: "",
                })
                setErrors({})
                onClose()
            }, 300) // Match the transition duration
        }
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose()
        }
    }

    const inputClass = (field: keyof typeof formData) =>
        `w-full px-3 py-2 border ${errors[field] ? "border-red-500" : "border-gray-300"
        } rounded-lg focus:ring-2 outline-none focus:ring-cardinal-pink-800 focus:border-cardinal-pink-800 transition-colors`

    if (!isOpen && !isAnimating) return null

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${isOpen && isAnimating ? 'opacity-50' : 'opacity-0'
                    }`}
                onClick={handleBackdropClick}
            />

            {/* Offcanvas Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen && isAnimating ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Edit Customer</h2>
                            <p className="text-sm text-gray-600">
                                {user ? `Editing ${user.firstName} ${user.lastName}` : 'Update user information'}
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={loading}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        >
                            <FiX className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Form Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto">
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className={inputClass("firstName")}
                                            placeholder="Enter first name"
                                        />
                                        {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className={inputClass("lastName")}
                                            placeholder="Enter last name"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={inputClass("email")}
                                            placeholder="Enter email address"
                                        />
                                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex">
                                            <select
                                                name="countryCode"
                                                value={formData.countryCode}
                                                onChange={handleChange}
                                                className="px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 outline-none focus:ring-cardinal-pink-800 focus:border-cardinal-pink-800 bg-white transition-colors"
                                            >
                                                <option value="+1">+1 (US)</option>
                                                <option value="+44">+44 (UK)</option>
                                                <option value="+91">+91 (IN)</option>
                                                <option value="+61">+61 (AU)</option>
                                                <option value="+81">+81 (JP)</option>
                                            </select>
                                            <input
                                                type="tel"
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleChange}
                                                className={`flex-1 px-3 py-2 border border-l-0 ${errors.phoneNumber ? "border-red-500" : "border-gray-300"
                                                    } rounded-r-lg focus:ring-2 outline-none focus:ring-cardinal-pink-800 focus:border-cardinal-pink-800 transition-colors`}
                                                placeholder="Enter phone number"
                                            />
                                        </div>
                                        {errors.phoneNumber && <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                            Password <span className="text-gray-500 text-xs">(leave empty to keep current)</span>
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={inputClass("password")}
                                            placeholder="Enter new password (optional)"
                                        />
                                        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer - Fixed at bottom */}
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
                                "Update Customer"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}