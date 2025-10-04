"use client"

import { useState, useEffect } from "react"
import axiosInstance from "@/lib/config/axios"
import { PAGE_TYPES } from "@/lib/models/Seo"

export default function SeoManagement() {
  const [selectedPage, setSelectedPage] = useState("")
  const [formData, setFormData] = useState({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  })
  const [currentSeoId, setCurrentSeoId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    if (selectedPage) {
      fetchSeoByType(selectedPage)
    } else {
      resetForm()
    }
  }, [selectedPage])

  const fetchSeoByType = async (type: string) => {
    setIsFetching(true)
    setError("")
    try {
      const response = await axiosInstance.get(`/admin/seo/type/${type}`)
      if (response.data.success) {
        const seoData = response.data.data
        setFormData({
          metaTitle: seoData.metaTitle,
          metaDescription: seoData.metaDescription,
          metaKeywords: seoData.metaKeywords,
        })
        setCurrentSeoId(seoData._id)
        setIsEditMode(true)
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setIsEditMode(false)
        setCurrentSeoId(null)
        setFormData({
          metaTitle: "",
          metaDescription: "",
          metaKeywords: "",
        })
      } else {
        setError(err.response?.data?.error || "Failed to fetch SEO data")
      }
    } finally {
      setIsFetching(false)
    }
  }

  const resetForm = () => {
    setFormData({
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
    })
    setCurrentSeoId(null)
    setIsEditMode(false)
    setError("")
    setSuccess("")
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!selectedPage) {
      setError("Please select a page")
      setIsLoading(false)
      return
    }

    try {
      if (isEditMode && currentSeoId) {
        const response = await axiosInstance.put(
          `/admin/seo/${currentSeoId}`,
          formData
        )
        setSuccess(response.data.message || "SEO data updated successfully")
      } else {
        const response = await axiosInstance.post("/admin/seo", {
          type: selectedPage,
          ...formData,
        })
        setSuccess(response.data.message || "SEO data created successfully")
        setCurrentSeoId(response.data.data._id)
        setIsEditMode(true)
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Failed to save SEO data"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!currentSeoId) return

    if (!confirm("Are you sure you want to delete this SEO data?")) return

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await axiosInstance.delete(`/admin/seo/${currentSeoId}`)
      setSuccess(response.data.message || "SEO data deleted successfully")
      resetForm()
      setSelectedPage("")
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete SEO data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    resetForm()
    setSelectedPage("")
  }

  const inputClass = (fieldName: string) => {
    return `w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 outline-none focus:ring-cardinal-pink-800 focus:border-cardinal-pink-800 transition-colors ${error && fieldName ? "border-red-500" : "border-gray-300"
      }`
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">SEO Management</h2>
            <p className="text-sm text-gray-600">Manage SEO metadata for your pages</p>
          </div>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Page Selection - Always visible */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Selection</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="selectedPage" className="block text-sm font-medium text-gray-700 mb-2">
                    Page Type *
                  </label>
                  <select
                    id="selectedPage"
                    name="selectedPage"
                    value={selectedPage}
                    onChange={(e) => setSelectedPage(e.target.value)}
                    className={inputClass("selectedPage")}
                    disabled={isFetching}
                  >
                    <option value="">Select a page</option>
                    {PAGE_TYPES.map((page: { value: string; label: string }) => (
                      <option key={page.value} value={page.value}>
                        {page.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Loader */}
            {isFetching && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-cardinal-pink-800 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading SEO data...</p>
              </div>
            )}

            {/* Form - Only show when not fetching and page is selected */}
            {!isFetching && selectedPage && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* SEO Section */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">SEO Optimization</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Title *
                        <span className="text-xs text-gray-500 ml-2">(Recommended: 50-60 characters)</span>
                      </label>
                      <input
                        type="text"
                        id="metaTitle"
                        name="metaTitle"
                        value={formData.metaTitle}
                        onChange={handleInputChange}
                        maxLength={150}
                        className={inputClass("metaTitle")}
                        placeholder="Enter meta title for search engines"
                        required
                        disabled={isLoading}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-gray-500 ml-auto">{formData.metaTitle.length}/150</span>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Description *
                        <span className="text-xs text-gray-500 ml-2">(Recommended: 150-160 characters)</span>
                      </label>
                      <textarea
                        id="metaDescription"
                        name="metaDescription"
                        value={formData.metaDescription}
                        onChange={handleInputChange}
                        maxLength={300}
                        rows={4}
                        className={inputClass("metaDescription")}
                        placeholder="Enter meta description for search engines"
                        required
                        disabled={isLoading}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-gray-500 ml-auto">{formData.metaDescription.length}/300</span>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="metaKeywords" className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Keywords *
                        <span className="text-xs text-gray-500 ml-2">(Separate with commas)</span>
                      </label>
                      <textarea
                        id="metaKeywords"
                        name="metaKeywords"
                        value={formData.metaKeywords}
                        onChange={handleInputChange}
                        rows={6}
                        className={inputClass("metaKeywords")}
                        placeholder="keyword1, keyword2, keyword3"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    {success}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Footer - Fixed at bottom - Only show when not fetching and page is selected */}
        {!isFetching && selectedPage && (
          <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="submit"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
              }
              disabled={isLoading}
              className="inline-flex items-center justify-center px-4 py-2.5 sm:py-2 text-sm sm:text-base bg-cardinal-pink-950 text-white font-medium rounded-lg hover:bg-cardinal-pink-900 transition-colors whitespace-nowrap"
            >
              {isLoading ? "Processing..." : isEditMode ? "Update" : "Create"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}