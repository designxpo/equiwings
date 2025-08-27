"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FiX, FiUpload, FiSearch } from "react-icons/fi"
import axiosInstance from "@/lib/config/axios"
import toast from "react-hot-toast"
import { Editor } from "@tinymce/tinymce-react"
import type { Editor as TinyMCEEditor } from "tinymce"

interface FormData {
  title: string
  slug: string
  content: string
  category: string
  status: string
  // SEO Fields
  metaTitle: string
  metaDescription: string
  metaKeywords: string
}

interface FormErrors extends Partial<FormData> {
  featuredImage?: string
}

interface CreateBlogOffcanvasProps {
  isOpen: boolean
  onClose: () => void
  onBlogCreated?: () => void
}

export default function CreateBlogOffcanvas({ isOpen, onClose, onBlogCreated }: CreateBlogOffcanvasProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    slug: "",
    content: "",
    category: "Technology",
    status: "draft",
    // SEO Fields
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  })
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  const categories: string[] = ["Technology", "Lifestyle", "Business", "Health", "Travel", "Food", "Fashion", "Sports"]

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

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {}
    if (!formData.title.trim()) newErrors.title = "Blog title is required"
    if (!formData.content.trim()) newErrors.content = "Content is required"
    if (formData.content.length < 50) newErrors.content = "Content must be at least 50 characters"

    // SEO validations
    if (formData.metaTitle && formData.metaTitle.length > 60) {
      newErrors.metaTitle = "Meta title should not exceed 60 characters"
    }
    if (formData.metaDescription && formData.metaDescription.length > 160) {
      newErrors.metaDescription = "Meta description should not exceed 160 characters"
    }

    return newErrors
  }

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/@/g, "at")
      .replace(/\+/g, "plus")
      .replace(/\$/g, "dollar")
      .replace(/%/g, "percent")
      .replace(/=/g, "equals")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .trim()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("title", formData.title)
      formDataToSend.append("slug", formData.slug || generateSlug(formData.title))
      formDataToSend.append("content", formData.content)
      formDataToSend.append("category", formData.category)
      formDataToSend.append("status", formData.status)

      // Append SEO fields
      if (formData.metaTitle) formDataToSend.append("metaTitle", formData.metaTitle)
      if (formData.metaDescription) formDataToSend.append("metaDescription", formData.metaDescription)
      if (formData.metaKeywords) formDataToSend.append("metaKeywords", formData.metaKeywords)

      if (featuredImage) {
        formDataToSend.append("featuredImage", featuredImage)
      }

      await axiosInstance.post("/admin/blogs", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Blog created successfully!")
      resetForm()
      onBlogCreated?.()
      handleClose()
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "error" in error.response.data &&
        typeof error.response.data.error === "string"
          ? error.response.data.error
          : "Failed to create blog"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = (): void => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      category: "Technology",
      status: "draft",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
    })
    setFeaturedImage(null)
    setErrors({})
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target
    if (name === "title") {
      setFormData({
        ...formData,
        title: value,
        slug: generateSlug(value),
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleEditorChange = (content: string): void => {
    setFormData({
      ...formData,
      content: content,
    })
    setErrors((prev) => ({ ...prev, content: "" }))
  }

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setFeaturedImage(e.target.files[0])
      setErrors((prev) => ({ ...prev, featuredImage: "" }))
    }
  }

  const handleClose = (): void => {
    if (!loading) {
      setIsAnimating(false)
      setTimeout(() => {
        resetForm()
        onClose()
      }, 300)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const inputClass = (field: keyof FormData): string =>
    `w-full px-3 py-2 border ${
      errors[field] ? "border-red-500" : "border-gray-300"
    } rounded-lg focus:ring-2 outline-none focus:ring-cardinal-pink-800 focus:border-cardinal-pink-800 transition-colors`

  if (!isOpen && !isAnimating) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
          isOpen && isAnimating ? "opacity-50" : "opacity-0"
        }`}
        onClick={handleBackdropClick}
      />

      {/* Offcanvas Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-4xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen && isAnimating ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create Blog</h2>
              <p className="text-sm text-gray-600">Add a new blog post with SEO optimization</p>
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
            <div className="p-6">
              <div className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Blog Title *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        maxLength={200}
                        className={inputClass("title")}
                        placeholder="Enter blog title"
                      />
                      {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                    </div>

                    <div>
                      <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                        Slug (URL)
                      </label>
                      <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                        placeholder="auto-generated-from-title"
                      />
                      <p className="text-xs text-gray-500 mt-1">Auto-generated from title</p>
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={inputClass("category")}
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                        Status *
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={inputClass("status")}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SEO Section */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <FiSearch className="h-5 w-5 text-cardinal-pink-950" />
                    <h3 className="text-lg font-semibold text-gray-900">SEO Optimization</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Title
                        <span className="text-xs text-gray-500 ml-2">(Recommended: 50-60 characters)</span>
                      </label>
                      <input
                        type="text"
                        id="metaTitle"
                        name="metaTitle"
                        value={formData.metaTitle}
                        onChange={handleChange}
                        maxLength={60}
                        className={inputClass("metaTitle")}
                        placeholder="Enter meta title for search engines"
                      />
                      <div className="flex justify-between mt-1">
                        {errors.metaTitle && <p className="text-sm text-red-500">{errors.metaTitle}</p>}
                        <span className="text-sm text-gray-500 ml-auto">{formData.metaTitle.length}/60</span>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Description
                        <span className="text-xs text-gray-500 ml-2">(Recommended: 150-160 characters)</span>
                      </label>
                      <textarea
                        id="metaDescription"
                        name="metaDescription"
                        value={formData.metaDescription}
                        onChange={handleChange}
                        maxLength={160}
                        rows={3}
                        className={inputClass("metaDescription")}
                        placeholder="Enter meta description for search engines"
                      />
                      <div className="flex justify-between mt-1">
                        {errors.metaDescription && <p className="text-sm text-red-500">{errors.metaDescription}</p>}
                        <span className="text-sm text-gray-500 ml-auto">{formData.metaDescription.length}/160</span>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="metaKeywords" className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Keywords
                        <span className="text-xs text-gray-500 ml-2">(Separate with commas)</span>
                      </label>
                      <input
                        type="text"
                        id="metaKeywords"
                        name="metaKeywords"
                        value={formData.metaKeywords}
                        onChange={handleChange}
                        className={inputClass("metaKeywords")}
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Content</h3>
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    <div className={`border rounded-lg ${errors.content ? "border-red-500" : "border-gray-300"}`}>
                      <Editor
                        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                        value={formData.content}
                        onEditorChange={handleEditorChange}
                        init={{
                          height: 400,
                          menubar: true,
                          plugins: [
                            "advlist",
                            "autolink",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "preview",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "help",
                            "wordcount",
                          ],
                          toolbar:
                            "undo redo | blocks | " +
                            "bold italic underline strikethrough | alignleft aligncenter " +
                            "alignright alignjustify | outdent indent | numlist bullist | " +
                            "forecolor backcolor | link image media | code preview fullscreen",
                          content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                          skin: "oxide",
                          content_css: "default",
                          branding: false,
                          elementpath: false,
                          statusbar: true,
                          resize: true,
                          autosave_ask_before_unload: true,
                          autosave_interval: "30s",
                          autosave_prefix: "blog-content-",
                          autosave_restore_when_empty: false,
                          autosave_retention: "2m",
                          image_advtab: true,
                          link_assume_external_targets: true,
                          file_picker_types: "image",
                          paste_data_images: true,
                          automatic_uploads: true,
                          setup: (editor: TinyMCEEditor) => {
                            editor.on("change", () => {
                              editor.save()
                            })
                          },
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
                      <span className="text-sm text-gray-500 ml-auto">{formData.content.length} characters</span>
                    </div>
                  </div>
                </div>

                {/* Featured Image */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h3>
                  <div>
                    <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-2">
                      Featured Image
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center ${
                        errors.featuredImage ? "border-red-300" : "border-gray-300"
                      }`}
                    >
                      <FiUpload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <input
                        type="file"
                        id="featuredImage"
                        accept="image/*"
                        onChange={handleFeaturedImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="featuredImage"
                        className="cursor-pointer text-cardinal-pink-800 hover:text-cardinal-pink-950"
                      >
                        Click to upload featured image
                      </label>
                      {featuredImage && <p className="mt-2 text-sm text-gray-600">{featuredImage.name}</p>}
                      {errors.featuredImage && <p className="text-sm text-red-500 mt-1">{errors.featuredImage}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
              }
              disabled={loading}
              className="px-4 py-2 bg-cardinal-pink-950 text-white rounded-lg hover:bg-cardinal-pink-900 disabled:opacity-50 transition-colors"
            >
              {loading ? "Creating..." : "Create Blog"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
