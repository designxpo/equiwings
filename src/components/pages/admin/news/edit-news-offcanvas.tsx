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
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    newsDate: "",
    readMoreButton: "",
    isActive: true,
  })

  // Media fields - now store URLs
  const [imageUrl, setImageUrl] = useState<string>("")
  const [imagePreview, setImagePreview] = useState<string>("")
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [videoPreview, setVideoPreview] = useState<string>("")

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
      setImageUrl(news.image || "")
      setImagePreview(news.image || "")
      setVideoUrl(news.video || "")
      setVideoPreview(news.video || "")
      setErrors({})
    }
  }, [isOpen, news])

  const validateForm = () => {
    const newErrors: any = {}
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
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

  const uploadFileToS3 = async (file: File): Promise<string> => {
    try {
      const presignedResponse = await axiosInstance.post("/admin/news/presigned-url", {
        fileName: file.name,
        contentType: file.type,
      })

      const { uploadUrl, fileUrl } = presignedResponse.data

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to S3")
      }

      return fileUrl
    } catch (error: any) {
      console.error("S3 upload error:", error)
      throw new Error(error.response?.data?.error || "Failed to upload file")
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        validateFile(file, 'image')

        setUploadingImage(true)
        const url = await uploadFileToS3(file)
        setImageUrl(url)
        setImagePreview(url)
        toast.success("Image uploaded successfully!")
        setErrors((prev: any) => ({ ...prev, image: "" }))
      } catch (error: any) {
        toast.error(error.message)
        e.target.value = ''
      } finally {
        setUploadingImage(false)
      }
    }
  }

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        validateFile(file, 'video')

        setUploadingVideo(true)
        const url = await uploadFileToS3(file)
        setVideoUrl(url)
        setVideoPreview(url)
        toast.success("Video uploaded successfully!")
        setErrors((prev: any) => ({ ...prev, video: "" }))
      } catch (error: any) {
        toast.error(error.message)
        e.target.value = ''
      } finally {
        setUploadingVideo(false)
      }
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
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        newsDate: formData.newsDate.trim(),
        readMoreButton: formData.readMoreButton.trim(),
        isActive: formData.isActive,
        image: imageUrl,
        video: videoUrl,
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

      if (error.response?.status === 400) {
        setErrors({ general: errorMessage })
      }
    } finally {
      setLoading(false)
    }
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
    if (!loading && !uploadingImage && !uploadingVideo) {
      setIsAnimating(false)
      setTimeout(() => {
        setFormData({
          title: "",
          description: "",
          newsDate: "",
          readMoreButton: "",
          isActive: true,
        })
        setImageUrl("")
        setImagePreview("")
        setVideoUrl("")
        setVideoPreview("")
        setErrors({})
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
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${isOpen && isAnimating ? "opacity-50" : "opacity-0"
          }`}
        onClick={handleBackdropClick}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen && isAnimating ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit News</h2>
              <p className="text-sm text-gray-600">
                {news ? `Editing "${news.title}" (${news.newsType})` : "Update news article"}
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={loading || uploadingImage || uploadingVideo}
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

                {news && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {news.newsType === 'secondary' ? (
                        <FiVideo className="h-5 w-5 text-purple-600" />
                      ) : (
                        <FiFileText className="h-5 w-5 text-blue-600" />
                      )}
                      <span className="font-medium text-gray-900">
                        {news.newsType === 'secondary' ? 'Secondary News' : 'Primary News'}
                      </span>
                      <span className="text-sm text-gray-500">(Type cannot be changed)</span>
                    </div>
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
                  </label>
                  <input
                    type="date"
                    id="newsDate"
                    name="newsDate"
                    value={formData.newsDate}
                    onChange={handleChange}
                    className={inputClass("newsDate")}
                  />
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

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>
                  <div className="space-y-4">
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageUrl("")
                            setImagePreview("")
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="image"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {uploadingImage ? (
                            <>
                              <svg className="animate-spin h-8 w-8 mb-4 text-cardinal-pink-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <p className="text-sm text-gray-500">Uploading image...</p>
                            </>
                          ) : (
                            <>
                              <FiUpload className="w-8 h-8 mb-4 text-gray-500" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> new image
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                            </>
                          )}
                        </div>
                        <input
                          id="image"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {news?.newsType === "secondary" && (
                  <div>
                    <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-2">
                      Video
                    </label>
                    <div className="space-y-4">
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
                              setVideoUrl("")
                              setVideoPreview("")
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="video"
                          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${uploadingVideo ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {uploadingVideo ? (
                              <>
                                <svg className="animate-spin h-8 w-8 mb-4 text-cardinal-pink-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="text-sm text-gray-500">Uploading video...</p>
                              </>
                            ) : (
                              <>
                                <FiVideo className="w-8 h-8 mb-4 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> new video
                                </p>
                                <p className="text-xs text-gray-500">MP4, WebM up to 50MB</p>
                              </>
                            )}
                          </div>
                          <input
                            id="video"
                            type="file"
                            className="hidden"
                            accept="video/*"
                            onChange={handleVideoChange}
                            disabled={uploadingVideo}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

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
              disabled={loading || uploadingImage || uploadingVideo}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading || uploadingImage || uploadingVideo}
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
    </div>
  )
}