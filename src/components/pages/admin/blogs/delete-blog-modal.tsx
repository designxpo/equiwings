"use client"
import type React from "react"
import { useEffect } from "react"
import { FiX, FiAlertTriangle, FiTrash2 } from "react-icons/fi"

interface DeleteBlogModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    loading: boolean
    blogTitle?: string
}

const DeleteBlogModal: React.FC<DeleteBlogModalProps> = ({ isOpen, onClose, onConfirm, loading, blogTitle }) => {
    // Close when the user presses ESC
    useEffect(() => {
        if (!isOpen) return
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose()
            }
        }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [isOpen, onClose])

    // Prevent scrolling behind the modal
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
            return () => {
                document.body.style.overflow = ""
            }
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            aria-labelledby="delete-modal-title"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md transform rounded-xl bg-white shadow-2xl transition-all sm:max-w-lg"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between gap-3 border-b border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                            <FiAlertTriangle className="h-5 w-5 text-red-600" />
                        </span>
                        <h3 id="delete-modal-title" className="text-lg font-semibold text-gray-900">
                            Delete Blog
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50"
                    >
                        <FiX className="h-5 w-5" />
                        <span className="sr-only">Close dialog</span>
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-6 p-6 text-center">
                    <p className="text-gray-700">
                        Are you sure you want to delete {blogTitle ? `"${blogTitle}"` : "this blog"}? This action cannot be undone.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:justify-end">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex min-w-[120px] items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Deleting…
                                </>
                            ) : (
                                <>
                                    <FiTrash2 className="h-4 w-4" />
                                    Delete
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteBlogModal
