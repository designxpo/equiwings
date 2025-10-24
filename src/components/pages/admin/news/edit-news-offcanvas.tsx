"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FiX, FiUpload, FiFileText, FiVideo } from "react-icons/fi"
import axiosInstance from "@/lib/config/axios"
import toast from "react-hot-toast"

type News = {
  _id: string
  title: string
  description: string
  newsDate: string
  newsType: 'primary' | 'secondary'
  image?: string
  video?: string
  readMoreButton?: string
  isActive: boolean
  slug: string
  createdAt: string
  updatedAt: string
}

interface EditNewsOffcanvasProps {
  isOpen: boolean
  onClose: () => void
  onNewsUpdated?: () => void
  news: News | null
}

export default function EditNewsOffcanvas({ isOpen, onClose, onNewsUpdated, news }: EditNewsOffcanvasProps) {
  const [loading, setLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
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
  const [currentImage, setCurrentImage] = useState<string>("")
  const [removeImage, setRemoveImage] = useState(false)

  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string>("")
  const [currentVideo, setCurrentVideo] = useState<string>("")
  const [removeVideo, setRemoveVideo] = useState(false)

  const [errors, setErrors] = useState<any>({})

  // Handle smooth transitions
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

  // Populate form data when news prop changes
  useEffect(() => {
    if (isOpen && news) {
      setFormData({
        title: news.title || "",
        description: news.description || "",
        newsDate: news.newsDate || "",
        readMoreButton: news.readMoreButton || "",
        isActive: news.isActive ?? true,
      })

      // Set current media
      setCurrentImage(news.image || "")
      setCurrentVideo(news.video || "")

      // Reset new uploads and flags
      setImageFile(null)
      setImagePreview("")
      setRemoveImage(false)
      setVideoFile(null)
      setVideoPreview("")
      setRemoveVideo(false)
      setErrors({})
    }
  }, [isOpen, news])

  const validateForm = () => {
    const newErrors: any = {}
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    // if (!formData.newsDate.trim()) newErrors.newsDate = "News date is required"
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

  // Upload file to S3 using presigned URL
  const uploadToS3 = async (file: File): Promise<string> => {
    try {
      // Get presigned URL from backend
      const { data } = await axiosInstance.post("/admin/news/presigned-url", {
        fileName: file.name,
        fileType: file.type,
      })

      const { uploadUrl, fileUrl } = data

      // Upload file directly to S3
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      })

      return fileUrl
    } catch (error: any) {
      console.error("S3 upload error:", error)
      throw new Error("Failed to upload file to S3")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!news) return

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      let imageUrl = ""
      let videoUrl = ""

      // Upload new image to S3 if present
      if (imageFile) {
        toast.loading("Uploading image...")
        imageUrl = await uploadToS3(imageFile)
        toast.dismiss()
      }

      // Upload new video to S3 if present
      if (videoFile) {
        toast.loading("Uploading video...")
        videoUrl = await uploadToS3(videoFile)
        toast.dismiss()
      }

      // Prepare payload
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        newsDate: formData.newsDate.trim(),
        isActive: formData.isActive,
        readMoreButton: formData.readMoreButton.trim(),
        imageUrl: imageUrl || undefined,  // New S3 URL if uploaded
        videoUrl: videoUrl || undefined,  // New S3 URL if uploaded
        removeImage: removeImage,          // Flag to remove existing image
        removeVideo: removeVideo,          // Flag to remove existing video
      }

      const response = await axiosInstance.put(`/admin/news/${news._id}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      toast.success(response.data.message || "News updated successfully!")
      onNewsUpdated?.()
      handleClose()
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to update news"
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
    setImageFile(null)
    setImagePreview("")
    setCurrentImage("")
    setRemoveImage(false)
    setVideoFile(null)
    setVideoPreview("")
    setCurrentVideo("")
    setRemoveVideo(false)
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

  const handleRemoveCurrentImage = () => {
    setCurrentImage("")
    setRemoveImage(true)
  }

  const handleRemoveCurrentVideo = () => {
    setCurrentVideo("")
    setRemoveVideo(true)
  }

  const inputClass = (fieldName: string) =>
    `block w-full px-4 py-2 border ${errors[fieldName] ? "border-red-500" : "border-gray-300"
    } rounded-lg focus:ring-2 focus:ring-cardinal-pink-800 focus:border-transparent transition-colors`

  if (!isOpen && !isAnimating) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-end transition-opacity duration-300 ${isAnimating && isOpen ? "opacity-100" : "opacity-0"
        }`}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 bg-opacity-50 transition-opacity duration-300" />

      {/* Offcanvas Panel */}
      <div
        className={`relative w-full h-full sm:w-[600px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isAnimating && isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header - Fixed at top */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit News</h2>
            <p className="text-sm text-gray-500 mt-1">Update news information</p>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  News Date
                  {/* <span className="text-red-500">*</span> */}
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

              {/* Image Field */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <div className="space-y-4">
                  {/* Current Image */}
                  {currentImage && !imagePreview && (
                    <div className="relative">
                      <img
                        src={currentImage || "/placeholder.svg"}
                        alt="Current"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        Current Image
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCurrentImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Upload Area */}
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
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
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>

                  {/* New Image Preview */}
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                        New Image
                      </div>
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

              {/* Video Field */}
              {news?.newsType === "secondary" && <div>
                <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-2">
                  Video
                </label>
                <div className="space-y-4">
                  {currentVideo && !videoPreview && (
                    <div className="relative">
                      <video
                        src={currentVideo}
                        className="w-full h-48 object-cover rounded-lg"
                        controls
                      />
                      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        Current Video
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCurrentVideo}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="video"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiVideo className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> new video
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
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                        New Video
                      </div>
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
            </form>
          </div>
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
                Updating...
              </>
            ) : (
              "Update News"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}