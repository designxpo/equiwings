"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { FiX, FiUpload, FiStar, FiPlus, FiTrash2 } from "react-icons/fi"
import axiosInstance from "@/lib/config/axios"
import toast from "react-hot-toast"

interface CreateProductOffcanvasProps {
  isOpen: boolean
  onClose: () => void
  onProductCreated?: () => void
}

interface Review {
  reviewerName: string
  rating: number
  comment: string
}

export default function CreateProductOffcanvas({ isOpen, onClose, onProductCreated }: CreateProductOffcanvasProps) {
  const [loading, setLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "TSHIRTS",
    price: "",
    quantity: "",
    sizes: [] as string[],
    colors: [] as string[],
  })

  const [mainImage, setMainImage] = useState<File | null>(null)
  const [additionalImages, setAdditionalImages] = useState<File[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState<Review>({
    reviewerName: "",
    rating: 5,
    comment: ""
  })
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [errors, setErrors] = useState<Partial<typeof formData> & { mainImage?: string; reviewerName?: string; comment?: string }>({})

  const categories = ["TSHIRTS", "PANTS", "CAPS", "BAGS", "ACCESSORIES"]
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const availableColors = ["black", "white", "gray", "navy", "red", "blue", "green"]

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

  const validateForm = () => {
    const newErrors: Partial<typeof formData> & { mainImage?: string; reviewerName?: string; comment?: string } = {}

    if (!formData.name.trim()) newErrors.name = "Product name is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.price.trim()) newErrors.price = "Price is required"
    else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0)
      newErrors.price = "Price must be a valid positive number"
    if (!formData.quantity.trim()) newErrors.quantity = "Quantity is required"
    else if (isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0)
      newErrors.quantity = "Quantity must be a valid non-negative number"

    if (!mainImage) {
      newErrors.mainImage = "Main image is required"
    }

    return newErrors
  }

  const validateReview = () => {
    const newErrors: { reviewerName?: string; comment?: string } = {}

    if (!newReview.reviewerName.trim()) newErrors.reviewerName = "Reviewer name is required"
    if (!newReview.comment.trim()) newErrors.comment = "Review comment is required"
    else if (newReview.comment.length > 1000) newErrors.comment = "Comment must be less than 1000 characters"

    return newErrors
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
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("category", formData.category)
      formDataToSend.append("price", formData.price)
      formDataToSend.append("quantity", formData.quantity)
      formDataToSend.append("sizes", JSON.stringify(formData.sizes))
      formDataToSend.append("colors", JSON.stringify(formData.colors))
      formDataToSend.append("reviews", JSON.stringify(reviews))

      // Calculate ratings from reviews
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
        const averageRating = totalRating / reviews.length
        formDataToSend.append("ratings", JSON.stringify({
          average: averageRating,
          count: reviews.length
        }))
      }

      if (mainImage) {
        formDataToSend.append("mainImage", mainImage)
      }

      additionalImages.forEach((image) => {
        formDataToSend.append(`additionalImages`, image)
      })

      await axiosInstance.post("/admin/products", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Product created successfully!")
      resetForm()
      onProductCreated?.()
      handleClose()
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "TSHIRTS",
      price: "",
      quantity: "",
      sizes: [],
      colors: [],
    })
    setMainImage(null)
    setAdditionalImages([])
    setReviews([])
    setNewReview({ reviewerName: "", rating: 5, comment: "" })
    setShowReviewForm(false)
    setErrors({})
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }))
  }

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewReview({
      ...newReview,
      [e.target.name]: e.target.value,
    })
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }))
  }

  const handleRatingChange = (rating: number) => {
    setNewReview({
      ...newReview,
      rating
    })
  }

  const addReview = () => {
    const reviewErrors = validateReview()
    if (Object.keys(reviewErrors).length > 0) {
      setErrors(reviewErrors)
      return
    }

    setReviews([...reviews, { ...newReview }])
    setNewReview({ reviewerName: "", rating: 5, comment: "" })
    setShowReviewForm(false)
    setErrors({})
    toast.success("Review added successfully!")
  }

  const removeReview = (index: number) => {
    setReviews(reviews.filter((_, i) => i !== index))
  }

  const handleSizeToggle = (size: string) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.includes(size) ? formData.sizes.filter((s) => s !== size) : [...formData.sizes, size],
    })
  }

  const handleColorToggle = (color: string) => {
    setFormData({
      ...formData,
      colors: formData.colors.includes(color)
        ? formData.colors.filter((c) => c !== color)
        : [...formData.colors, color],
    })
  }

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0])
      setErrors((prev) => ({ ...prev, mainImage: "" }))
    }
  }

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      if (files.length > 5) {
        toast.error("Maximum 5 additional images allowed")
        return
      }
      setAdditionalImages(files)
    }
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
    `w-full px-3 py-2 border ${errors[field as keyof typeof errors] ? "border-red-500" : "border-gray-300"
    } rounded-lg focus:ring-2 outline-none focus:ring-cardinal-pink-800 focus:border-cardinal-pink-800 transition-colors`

  const renderStars = (rating: number, interactive: boolean = false, size: string = "h-5 w-5") => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={interactive ? () => handleRatingChange(star) : undefined}
            className={`${interactive ? 'hover:text-yellow-400 cursor-pointer' : 'cursor-default'} transition-colors`}
          >
            <FiStar
              className={`${size} ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0
    const total = reviews.reduce((sum, review) => sum + review.rating, 0)
    return (total / reviews.length).toFixed(1)
  }

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
        className={`fixed top-0 right-0 h-full w-full max-w-4xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen && isAnimating ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create Product</h2>
              <p className="text-sm text-gray-600">Add a new product to your inventory</p>
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
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      maxLength={200}
                      className={inputClass("name")}
                    />
                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
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

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      required
                      className={inputClass("price")}
                    />
                    {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
                  </div>

                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="0"
                      required
                      className={inputClass("quantity")}
                    />
                    {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                    maxLength={2000}
                    className={inputClass("description")}
                  />
                  {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className={`px-3 py-1 text-sm rounded-lg border transition-colors ${formData.sizes.includes(size)
                          ? "bg-cardinal-pink-900 text-white border-cardinal-pink-900"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Colors</label>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorToggle(color)}
                        className={`px-3 py-1 text-sm rounded-lg border transition-colors capitalize ${formData.colors.includes(color)
                          ? "bg-cardinal-pink-900 text-white border-cardinal-pink-900"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full border border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                          <span>{color}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reviews & Ratings Section */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Reviews & Ratings</h3>
                      <p className="text-sm text-gray-600">Add initial reviews for this product</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(true)}
                      className="flex items-center space-x-2 px-3 py-2 bg-cardinal-pink-950 text-white rounded-lg hover:bg-cardinal-pink-900 transition-colors"
                    >
                      <FiPlus className="h-4 w-4" />
                      <span>Add Review</span>
                    </button>
                  </div>

                  {/* Current Rating Summary */}
                  {reviews.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {renderStars(parseFloat(calculateAverageRating() as string) || 0)}
                          <span className="text-lg font-medium text-gray-900">
                            {calculateAverageRating()}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Add Review Form */}
                  {showReviewForm && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Add New Review</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reviewer Name *
                          </label>
                          <input
                            type="text"
                            name="reviewerName"
                            value={newReview.reviewerName}
                            onChange={handleReviewChange}
                            className={inputClass("reviewerName")}
                            placeholder="Enter reviewer name"
                          />
                          {errors.reviewerName && <p className="text-sm text-red-500 mt-1">{errors.reviewerName}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rating *
                          </label>
                          {renderStars(newReview.rating, true)}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Comment *
                          </label>
                          <textarea
                            name="comment"
                            value={newReview.comment}
                            onChange={handleReviewChange}
                            rows={3}
                            maxLength={1000}
                            className={inputClass("comment")}
                            placeholder="Write your review..."
                          />
                          <div className="flex justify-between mt-1">
                            {errors.comment && <p className="text-sm text-red-500">{errors.comment}</p>}
                            <span className="text-sm text-gray-500 ml-auto">
                              {newReview.comment.length}/1000
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowReviewForm(false)
                              setNewReview({ reviewerName: "", rating: 5, comment: "" })
                              setErrors({})
                            }}
                            className="px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={addReview}
                            className="px-3 py-2 bg-cardinal-pink-950 text-white rounded-lg hover:bg-cardinal-pink-900 transition-colors"
                          >
                            Add Review
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Existing Reviews */}
                  {reviews.length > 0 && (
                    <div className="space-y-3">
                      {reviews.map((review, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-medium text-gray-900">{review.reviewerName}</span>
                                {renderStars(review.rating, false, "h-4 w-4")}
                              </div>
                              <p className="text-gray-700 text-sm">{review.comment}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeReview(index)}
                              className="p-1 text-red-500 hover:text-red-700 transition-colors"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Images */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="mainImage" className="block text-sm font-medium text-gray-700 mb-2">
                      Main Image *
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center ${errors.mainImage ? "border-red-300" : "border-gray-300"
                        }`}
                    >
                      <FiUpload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <input
                        type="file"
                        id="mainImage"
                        accept="image/*"
                        onChange={handleMainImageChange}
                        className="hidden"
                        required
                      />
                      <label htmlFor="mainImage" className="cursor-pointer text-cardinal-pink-800 hover:text-cardinal-pink-950">
                        Click to upload main image
                      </label>
                      {mainImage && <p className="mt-2 text-sm text-gray-600">{mainImage.name}</p>}
                      {errors.mainImage && <p className="text-sm text-red-500 mt-1">{errors.mainImage}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="additionalImages" className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Images (Optional - Max 5)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <FiUpload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <input
                        type="file"
                        id="additionalImages"
                        accept="image/*"
                        multiple
                        onChange={handleAdditionalImagesChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="additionalImages"
                        className="cursor-pointer text-cardinal-pink-800 hover:text-cardinal-pink-950"
                      >
                        Click to upload additional images
                      </label>
                      {additionalImages.length > 0 && (
                        <p className="mt-2 text-sm text-gray-600">{additionalImages.length} file(s) selected</p>
                      )}
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
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-cardinal-pink-950 text-white rounded-lg hover:bg-cardinal-pink-900 disabled:opacity-50 transition-colors"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}