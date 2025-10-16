"use client"
import type React from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import axiosInstance from "@/lib/config/axios"
import { Pagination } from "@/utils/pagination"
import { ItemSkeleton } from "@/utils/loaders"
import { useState, useEffect, useRef } from "react"
import { EditGalleryOffcanvas } from "./edit-gallery-offcanvas"
import { GalleryViewOffcanvas } from "./gallery-view-offcanvas"
import { CreateGalleryOffcanvas } from "./create-gallery-offcanvas"
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiMoreHorizontal, FiImage } from "react-icons/fi"
import DeleteModal from "./delete-modal"

// data type
type Gallery = {
    _id: string
    title: string
    image: string
    category: string
    order: number
    isActive: boolean
    createdAt: string
    updatedAt: string
}

type ApiResponse = {
    gallery: Gallery[]
    pagination: {
        page: number
        limit: number
        total: number
        pages: number
    }
}

// Custom Dropdown Component
const Dropdown = ({ children, trigger }: { children: React.ReactNode; trigger: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {children}
                </div>
            )}
        </div>
    )
}

const DropdownItem = ({
    children,
    onClick,
    href,
    className = "",
}: {
    children: React.ReactNode
    onClick?: () => void
    className?: string
    href?: string
}) => {
    const baseClasses = "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
    const classes = `${baseClasses} ${className}`

    if (href) {
        return (
            <Link href={href} className={classes}>
                {children}
            </Link>
        )
    }

    return (
        <button onClick={onClick} className={`${classes} w-full text-left`}>
            {children}
        </button>
    )
}

const CategoryBadge = ({ category }: { category: string }) => {
    const colors: Record<string, string> = {
        sports: "bg-blue-100 text-blue-800 border-blue-200",
        events: "bg-purple-100 text-purple-800 border-purple-200",
        facilities: "bg-green-100 text-green-800 border-green-200",
        achievements: "bg-yellow-100 text-yellow-800 border-yellow-200",
        training: "bg-orange-100 text-orange-800 border-orange-200",
        other: "bg-gray-100 text-gray-800 border-gray-200"
    }

    return (
        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${colors[category] || colors.other}`}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
        </span>
    )
}

export default function GalleryList() {
    const [gallery, setGallery] = useState<Gallery[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [tableLoading, setTableLoading] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [categoryFilter, setCategoryFilter] = useState<string>("")
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 1,
    })

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean
        gallery: Gallery | null
        loading: boolean
    }>({
        gallery: null,
        isOpen: false,
        loading: false,
    })

    const [editModal, setEditModal] = useState<{
        isOpen: boolean
        gallery: Gallery | null
    }>({
        isOpen: false,
        gallery: null,
    })

    const [viewModal, setViewModal] = useState<{
        isOpen: boolean
        galleryId: string | null
    }>({
        isOpen: false,
        galleryId: null,
    })

    useEffect(() => {
        loadGallery()
    }, [currentPage, searchTerm, categoryFilter])

    const loadGallery = async () => {
        try {
            setTableLoading(true)
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: "10",
                ...(searchTerm && { search: searchTerm }),
                ...(categoryFilter && { category: categoryFilter }),
            })
            const res = await axiosInstance.get(`/admin/gallery?${params}`)
            const data: ApiResponse = res.data
            setGallery(data.gallery)
            setPagination(data.pagination)
        } catch (error: any) {
            console.error("Failed to load gallery:", error)
            toast.error(error.response?.data?.error || "Failed to load gallery")
        } finally {
            setTableLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentPage(1)
        loadGallery()
    }

    const openEditModal = (gallery: Gallery) => {
        setEditModal({
            isOpen: true,
            gallery,
        })
    }

    const closeEditModal = () => {
        setEditModal({
            isOpen: false,
            gallery: null,
        })
    }

    const openViewModal = (galleryId: string) => {
        setViewModal({
            isOpen: true,
            galleryId,
        })
    }

    const closeViewModal = () => {
        setViewModal({
            isOpen: false,
            galleryId: null,
        })
    }

    const handleGalleryUpdated = () => {
        loadGallery()
    }

    const handleDelete = async () => {
        if (!deleteModal.gallery) return
        try {
            setDeleteModal((prev) => ({ ...prev, loading: true }))
            const response = await axiosInstance.delete(`/admin/gallery/${deleteModal.gallery._id}`)
            toast.success(response.data.message || "Gallery item deleted successfully")
            setDeleteModal({ isOpen: false, gallery: null, loading: false })
            loadGallery()
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to delete gallery item")
            setDeleteModal((prev) => ({ ...prev, loading: false }))
        }
    }

    const openDeleteModal = (gallery: Gallery) => {
        setDeleteModal({
            isOpen: true,
            gallery,
            loading: false,
        })
    }

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            gallery: null,
            loading: false,
        })
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleGalleryCreated = () => {
        loadGallery()
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    return (
        <div className="bg-gray-50">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Page Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <FiImage className="h-6 w-6 text-gray-500" />
                            <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
                        </div>
                        <p className="text-gray-600">Manage your gallery images</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full">
                            {pagination.total} {pagination.total === 1 ? "image" : "images"}
                        </span>
                    </div>
                </div>

                {/* Gallery Table Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Table Header */}
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col sm:flex-row gap-3 flex-1">
                                <form onSubmit={handleSearch} className="relative flex-1 sm:max-w-sm">
                                    <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search gallery..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cardinal-pink-900 outline-none focus:border-cardinal-pink-900 transition-colors text-sm sm:text-base"
                                    />
                                </form>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => {
                                        setCategoryFilter(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                    className="px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cardinal-pink-900 outline-none focus:border-cardinal-pink-900 transition-colors text-sm sm:text-base"
                                >
                                    <option value="">All Categories</option>
                                    <option value="sports">Sports</option>
                                    <option value="events">Events</option>
                                    <option value="facilities">Facilities</option>
                                    <option value="achievements">Achievements</option>
                                    <option value="training">Training</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="inline-flex items-center justify-center px-4 py-2.5 sm:py-2 text-sm sm:text-base bg-cardinal-pink-950 text-white font-medium rounded-lg hover:bg-cardinal-pink-900 transition-colors whitespace-nowrap"
                            >
                                <FiPlus className="mr-2 h-4 w-4" />
                                Add Image
                            </button>
                        </div>
                    </div>

                    {/* Table Content */}
                    {tableLoading ? (
                        <ItemSkeleton />
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Image
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {gallery.map((item) => (
                                            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-start space-x-4">
                                                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                                            <img
                                                                src={item.image || "/placeholder.svg"}
                                                                alt={item.title}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.src = "/placeholder.svg";
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-medium text-gray-900 truncate">{item.title}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <CategoryBadge category={item.category} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${item.isActive
                                                            ? "bg-green-100 text-green-800 border-green-200"
                                                            : "bg-red-100 text-red-800 border-red-200"
                                                            }`}
                                                    >
                                                        {item.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatDate(item.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Dropdown
                                                        trigger={
                                                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                                <FiMoreHorizontal className="h-4 w-4" />
                                                            </button>
                                                        }
                                                    >
                                                        <DropdownItem onClick={() => openViewModal(item._id)}>
                                                            <FiEye className="mr-2 h-4 w-4" />
                                                            View
                                                        </DropdownItem>
                                                        <DropdownItem onClick={() => openEditModal(item)}>
                                                            <FiEdit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownItem>
                                                        <DropdownItem
                                                            onClick={() => openDeleteModal(item)}
                                                            className="text-red-600 hover:bg-red-50"
                                                        >
                                                            <FiTrash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownItem>
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile/Tablet Cards */}
                            <div className="lg:hidden space-y-4 p-4">
                                {gallery.map((item) => (
                                    <div
                                        key={item._id}
                                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-3 flex-1">
                                                <div className="flex items-start space-x-3">
                                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                                        <img
                                                            src={item.image || "/placeholder.svg"}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = "/placeholder.svg";
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-gray-900 truncate">{item.title}</div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <CategoryBadge category={item.category} />
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${item.isActive
                                                            ? "bg-green-100 text-green-800 border-green-200"
                                                            : "bg-red-100 text-red-800 border-red-200"
                                                            }`}
                                                    >
                                                        {item.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                    <span className="text-xs text-gray-500">{formatDate(item.createdAt)}</span>
                                                </div>
                                            </div>
                                            <Dropdown
                                                trigger={
                                                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <FiMoreHorizontal className="h-4 w-4" />
                                                    </button>
                                                }
                                            >
                                                <DropdownItem onClick={() => openViewModal(item._id)}>
                                                    <FiEye className="mr-2 h-4 w-4" />
                                                    View
                                                </DropdownItem>
                                                <DropdownItem onClick={() => openEditModal(item)}>
                                                    <FiEdit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownItem>
                                                <DropdownItem onClick={() => openDeleteModal(item)} className="text-red-600 hover:bg-red-50">
                                                    <FiTrash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownItem>
                                            </Dropdown>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Empty State */}
                            {gallery.length === 0 && (
                                <div className="text-center py-12">
                                    <FiImage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No images found</h3>
                                    <p className="text-gray-500 mb-4">
                                        {searchTerm || categoryFilter
                                            ? "No images match your search criteria."
                                            : "Get started by adding your first gallery image."}
                                    </p>
                                    {!searchTerm && !categoryFilter && (
                                        <button
                                            onClick={() => setIsCreateModalOpen(true)}
                                            className="inline-flex items-center px-4 py-2 text-sm bg-cardinal-pink-950 text-white font-medium rounded-lg hover:bg-cardinal-pink-900 transition-colors"
                                        >
                                            <FiPlus className="mr-2 h-4 w-4" />
                                            Add Image
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Pagination */}
                {!tableLoading && gallery.length > 0 && (
                    <div className="flex justify-center">
                        <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={handlePageChange} />
                    </div>
                )}
            </div>

            {/* Modals */}
            {isCreateModalOpen && (
                <CreateGalleryOffcanvas
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onGalleryCreated={handleGalleryCreated}
                />
            )}

            {editModal.isOpen && editModal.gallery && (
                <EditGalleryOffcanvas
                    isOpen={editModal.isOpen}
                    onClose={closeEditModal}
                    gallery={editModal.gallery}
                    onGalleryUpdated={handleGalleryUpdated}
                />
            )}

            {deleteModal.isOpen && deleteModal.gallery && (
                <DeleteModal
                    isOpen={deleteModal.isOpen}
                    onClose={closeDeleteModal}
                    onConfirm={handleDelete}
                    loading={deleteModal.loading}
                />
            )}

            {viewModal.isOpen && viewModal.galleryId && (
                <GalleryViewOffcanvas isOpen={viewModal.isOpen} onClose={closeViewModal} galleryId={viewModal.galleryId} />
            )}
        </div>
    )
}