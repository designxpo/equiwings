"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axiosInstance from "@/lib/config/axios"
import { FiX, FiUpload, FiFileText, FiVideo } from "react-icons/fi"
import toast from "react-hot-toast"

interface CreateNewsOffcanvasProps {
  isOpen: boolean
  onClose: () => void
  onNewsCreated?: () => void
}

export default function CreateNewsOffcanvas({ isOpen, onClose, onNewsCreated }: CreateNewsOffcanvasProps) {
  const [loading, setLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [newsType, setNewsType] = useState<'primary' | 'secondary'>('primary')
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    newsDate: "",
    readMoreButton: "",
    isActive: true,
  })

  // Media fields
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string>("")

  const [errors, setErrors] = useState<any>({})

  // Handle smooth transitions
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      document.body.style.overflow = "hidden"
      // Set default date to today
      const today = new Date().toISOString().split('T')[0]
      setFormData(prev => ({ ...prev, newsDate: today }))
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
    if (!formData.newsDate.trim()) newErrors.newsDate = "News date is required"
    return newErrors
  }

  const validateFile = (file: File, type: 'image' | 'video') => {
    if (type === 'image') {
      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed")
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size must be less than 5MB")
      }
    } else if (type === 'video') {
      if (!file.type.startsWith("video/")) {
        throw new Error("Only video files are allowed")
      }
      if (file.size > 50 * 1024 * 1024) {
        throw new Error("Video size must be less than 50MB")
      }
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        validateFile(file, 'image')
        setImageFile(file)

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
        setErrors((prev: any) => ({ ...prev, image: "" }))
      } catch (error: any) {
        toast.error(error.message)
        e.target.value = '' // Reset input
      }
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        validateFile(file, 'video')
        setVideoFile(file)

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
          setVideoPreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
        setErrors((prev: any) => ({ ...prev, video: "" }))
      } catch (error: any) {
        toast.error(error.message)
        e.target.value = '' // Reset input
      }
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

      // Always include required fields with trimmed values
      submitFormData.append("title", formData.title.trim())
      submitFormData.append("description", formData.description.trim())
      submitFormData.append("newsDate", formData.newsDate.trim())
      submitFormData.append("newsType", newsType)
      submitFormData.append("isActive", formData.isActive.toString())
      submitFormData.append("readMoreButton", formData.readMoreButton.trim())

      // Append media files if present
      if (imageFile) {
        submitFormData.append("image", imageFile)
      }

      if (videoFile) {
        submitFormData.append("video", videoFile)
      }

      const response = await axiosInstance.post("/admin/news", submitFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success(response.data.message || "News created successfully!")
      resetForm()
      onNewsCreated?.()
      handleClose()
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to create news"
      toast.error(errorMessage)

      // Handle specific validation errors
      if (error.response?.status === 400) {
        setErrors({ general: errorMessage })
      }
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      newsDate: "",
      readMoreButton: "",
      isActive: true,
    })
    setNewsType('primary')
    setImageFile(null)
    setImagePreview("")
    setVideoFile(null)
    setVideoPreview("")
    setErrors({})
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    setErrors((prev: any) => ({ ...prev, [name]: "", general: "" }))
  }

  const handleNewsTypeChange = (newType: 'primary' | 'secondary') => {
    setNewsType(newType)
    // Clear errors when switching types
    setErrors({})
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
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const inputClass = (field: string) =>
    `w-full px-3 py-2 border ${errors[field] ? "border-red-500" : "border-gray-300"
    } rounded-lg focus:ring-2 outline-none focus:ring-cardinal-pink-800 focus:border-cardinal-pink-800 transition-colors`

  if (!isOpen && !isAnimating) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${isOpen && isAnimating ? "opacity-50" : "opacity-0"
          }`}
        onClick={handleBackdropClick}
      />
      {/* Offcanvas Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen && isAnimating ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create News</h2>
              <p className="text-sm text-gray-600">Add a new news article</p>
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
                {/* General Error */}
                {errors.general && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{errors.general}</p>
                  </div>
                )}

                {/* News Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    News Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleNewsTypeChange('primary')}
                      className={`p-4 border-2 rounded-lg transition-all ${newsType === 'primary'
                          ? 'border-cardinal-pink-800 bg-cardinal-pink-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <FiFileText className={`h-6 w-6 mx-auto mb-2 ${newsType === 'primary' ? 'text-cardinal-pink-800' : 'text-gray-400'
                        }`} />
                      <div className={`font-medium ${newsType === 'primary' ? 'text-cardinal-pink-800' : 'text-gray-700'
                        }`}>
                        Primary News
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Main news articles
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNewsTypeChange('secondary')}
                      className={`p-4 border-2 rounded-lg transition-all ${newsType === 'secondary'
                          ? 'border-cardinal-pink-800 bg-cardinal-pink-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <FiVideo className={`h-6 w-6 mx-auto mb-2 ${newsType === 'secondary' ? 'text-cardinal-pink-800' : 'text-gray-400'
                        }`} />
                      <div className={`font-medium ${newsType === 'secondary' ? 'text-cardinal-pink-800' : 'text-gray-700'
                        }`}>
                        Secondary News
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Secondary articles
                      </div>
                    </button>
                  </div>
                </div>

                {/* Common Fields */}
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
                    placeholder="Enter news title"
                  />
                  {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className={inputClass("description")}
                    placeholder="Enter news description"
                  />
                  {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label htmlFor="newsDate" className="block text-sm font-medium text-gray-700 mb-2">
                    News Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="newsDate"
                    name="newsDate"
                    value={formData.newsDate}
                    onChange={handleChange}
                    className={inputClass("newsDate")}
                  />
                  {errors.newsDate && <p className="text-sm text-red-500 mt-1">{errors.newsDate}</p>}
                </div>

                <div>
                  <label htmlFor="readMoreButton" className="block text-sm font-medium text-gray-700 mb-2">
                    Read More URL
                  </label>
                  <input
                    type="url"
                    id="readMoreButton"
                    name="readMoreButton"
                    value={formData.readMoreButton}
                    onChange={handleChange}
                    className={inputClass("readMoreButton")}
                    placeholder="Enter read more button URL"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="image"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FiUpload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        </div>
                        <input
                          id="image"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null)
                            setImagePreview("")
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Upload */}
                {newsType === "secondary" && <div>
                  <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-2">
                    Video
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="video"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FiVideo className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> video
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
                    {videoPreview && (
                      <div className="relative">
                        <video
                          src={videoPreview}
                          className="w-full h-48 object-cover rounded-lg"
                          controls
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setVideoFile(null)
                            setVideoPreview("")
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>}

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
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create News"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}