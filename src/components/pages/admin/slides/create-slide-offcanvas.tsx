"use client"
import type React from "react"
import { useState, useEffect } from "react"
import axiosInstance from "@/lib/config/axios"
import { FiX, FiUpload, FiPlus, FiTrash2 } from "react-icons/fi"
import toast from "react-hot-toast"
import { Editor } from '@tinymce/tinymce-react';

// ============ CREATE SLIDE MODAL ============
interface CreateSlideOffcanvasProps {
    isOpen: boolean
    onClose: () => void
    onSlideCreated?: () => void
}

// Configure TinyMCE Editor
export const editorConfig = {
    plugins: [
        // Core editing features
        'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media',
        'searchreplace', 'table', 'visualblocks', 'wordcount',
        // Premium features
        'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker',
        'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage',
        'advtemplate', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags'
    ],
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | ' +
        'link image media table mergetags | addcomment showcomments | ' +
        'spellcheckdialog a11ycheck typography | align lineheight | ' +
        'checklist numlist bullist indent outdent | emoticons charmap | removeformat',
    tinycomments_mode: 'embedded',
    tinycomments_author: 'Author name',
    mergetags_list: [
        { value: 'First.Name', title: 'First Name' },
        { value: 'Email', title: 'Email' },
    ],
    height: 300,
    menubar: false,
    branding: false,
    statusbar: false
};

export function CreateSlideOffcanvas({ isOpen, onClose, onSlideCreated }: CreateSlideOffcanvasProps) {
    const [loading, setLoading] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
    const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [videoPreview, setVideoPreview] = useState<string>("")
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        content: "",
        slug: "",
        isActive: true,
        order: "",
    })
    const [buttons, setButtons] = useState<Array<{ text: string; link: string }>>([])
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
        if (!formData.title.trim()) newErrors.title = "Title is required"
        if (!formData.description.trim()) newErrors.description = "Description is required"
        if (!formData.content.trim()) newErrors.content = "Content is required"
        if (!formData.slug.trim()) newErrors.slug = "Slug is required"
        if (!thumbnailFile) newErrors.thumbnail = "Thumbnail is required"

        // Validate buttons
        buttons.forEach((button, index) => {
            if (!button.text.trim()) {
                newErrors[`button_text_${index}`] = "Button text is required"
            }
            if (!button.link.trim()) {
                newErrors[`button_link_${index}`] = "Button link is required"
            }
        })

        return newErrors
    }

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast.error("Only image files are allowed for thumbnail")
                return
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Thumbnail size must be less than 5MB")
                return
            }
            setThumbnailFile(file)
            const reader = new FileReader()
            reader.onload = (e) => {
                setThumbnailPreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
            setErrors((prev: any) => ({ ...prev, thumbnail: "" }))
        }
    }

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (!file.type.startsWith("video/")) {
                toast.error("Only video files are allowed")
                return
            }
            if (file.size > 50 * 1024 * 1024) {
                toast.error("Video size must be less than 50MB")
                return
            }
            setVideoFile(file)
            const reader = new FileReader()
            reader.onload = (e) => {
                setVideoPreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
            setErrors((prev: any) => ({ ...prev, video: "" }))
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        const checked = (e.target as HTMLInputElement).checked

        // Auto-generate slug from title
        if (name === "title") {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")
            setFormData((prev) => ({
                ...prev,
                title: value,
                slug: slug
            }))
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }))
        }
        setErrors((prev: any) => ({ ...prev, [name]: "", general: "" }))
    }

    const addButton = () => {
        setButtons([...buttons, { text: "", link: "" }])
    }

    const removeButton = (index: number) => {
        setButtons(buttons.filter((_, i) => i !== index))
        // Clear errors for this button
        setErrors((prev: any) => {
            const newErrors = { ...prev }
            delete newErrors[`button_text_${index}`]
            delete newErrors[`button_link_${index}`]
            return newErrors
        })
    }

    const handleButtonChange = (index: number, field: "text" | "link", value: string) => {
        const newButtons = [...buttons]
        newButtons[index][field] = value
        setButtons(newButtons)
        setErrors((prev: any) => ({ ...prev, [`button_${field}_${index}`]: "" }))
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
            submitFormData.append("order", formData.order)

            if (thumbnailFile) {
                submitFormData.append("thumbnail", thumbnailFile)
            }

            if (videoFile) {
                submitFormData.append("video", videoFile)
            }

            if (buttons.length > 0) {
                submitFormData.append("buttons", JSON.stringify(buttons))
            }

            const response = await axiosInstance.post("/admin/slides", submitFormData, {
                headers: { "Content-Type": "multipart/form-data" },
            })

            toast.success(response.data.message || "Slide created successfully!")
            resetForm()
            onSlideCreated?.()
            handleClose()
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || "Failed to create slide"
            toast.error(errorMessage)
            setErrors({ general: errorMessage })
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({ title: "", description: "", content: "", slug: "", isActive: true, order: "" })
        setThumbnailFile(null)
        setThumbnailPreview("")
        setVideoFile(null)
        setVideoPreview("")
        setButtons([])
        setErrors({})
    }

    const handleEditorChange = (content: string) => {
        handleChange({
            target: {
                name: 'content',
                value: content
            }
        } as React.ChangeEvent<HTMLTextAreaElement>);
    };

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
                            <h2 className="text-xl font-bold text-gray-900">Create Slide</h2>
                            <p className="text-sm text-gray-600">Add a new carousel slide</p>
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
                                        placeholder="Enter slide title"
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
                                        placeholder="slide-url-slug"
                                    />
                                    {errors.slug && <p className="text-sm text-red-500 mt-1">{errors.slug}</p>}
                                    <p className="text-xs text-gray-500 mt-1">Auto-generated from title, but you can customize it</p>
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
                                        rows={3}
                                        className={inputClass("description")}
                                        placeholder="Enter short description"
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
                                        placeholder="Leave empty for auto-increment"
                                        min="1"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Leave empty to automatically set the next available order number
                                    </p>
                                </div>

                                {/* Buttons Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Action Buttons (Optional)
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addButton}
                                            className="text-sm text-cardinal-pink-800 hover:text-cardinal-pink-900 font-medium flex items-center"
                                        >
                                            <FiPlus className="mr-1 h-4 w-4" />
                                            Add Button
                                        </button>
                                    </div>
                                    {buttons.map((button, index) => (
                                        <div key={index} className="mb-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-gray-700">Button {index + 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeButton(index)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <FiTrash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={button.text}
                                                        onChange={(e) => handleButtonChange(index, "text", e.target.value)}
                                                        placeholder="Button text"
                                                        className={inputClass(`button_text_${index}`)}
                                                    />
                                                    {errors[`button_text_${index}`] && (
                                                        <p className="text-sm text-red-500 mt-1">{errors[`button_text_${index}`]}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={button.link}
                                                        onChange={(e) => handleButtonChange(index, "link", e.target.value)}
                                                        placeholder="Button link (e.g., /about or https://example.com)"
                                                        className={inputClass(`button_link_${index}`)}
                                                    />
                                                    {errors[`button_link_${index}`] && (
                                                        <p className="text-sm text-red-500 mt-1">{errors[`button_link_${index}`]}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
                                        Thumbnail Image <span className="text-red-500">*</span>
                                    </label>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center w-full">
                                            <label
                                                htmlFor="thumbnail"
                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <FiUpload className="w-8 h-8 mb-4 text-gray-500" />
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to upload thumbnail</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                                </div>
                                                <input
                                                    id="thumbnail"
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleThumbnailChange}
                                                />
                                            </label>
                                        </div>
                                        {thumbnailPreview && (
                                            <div className="relative">
                                                <img
                                                    src={thumbnailPreview}
                                                    alt="Thumbnail Preview"
                                                    className="w-full h-48 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setThumbnailFile(null)
                                                        setThumbnailPreview("")
                                                    }}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                >
                                                    <FiX className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        {errors.thumbnail && <p className="text-sm text-red-500">{errors.thumbnail}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-2">
                                        Video (Optional)
                                    </label>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center w-full">
                                            <label
                                                htmlFor="video"
                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <FiUpload className="w-8 h-8 mb-4 text-gray-500" />
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to upload video</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500">MP4, WebM up to 50MB</p>
                                                </div>
                                                <input
                                                    id="video"
                                                    type="file"
                                                    className="hidden"
                                                    accept="video/*"
                                                    onChange={handleVideoChange}
                                                />
                                            </label>
                                        </div>
                                        {videoFile && (
                                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-blue-700">
                                                        <strong>Video selected:</strong> {videoFile.name}
                                                    </p>
                                                    <p className="text-xs text-blue-600 mt-1">
                                                        Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setVideoFile(null)
                                                        setVideoPreview("")
                                                    }}
                                                    className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                >
                                                    <FiX className="w-4 h-4" />
                                                </button>
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
                                    Creating...
                                </>
                            ) : (
                                "Create Slide"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}