"use client"
import type React from "react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiMoreHorizontal, FiFileText } from "react-icons/fi"
import DeleteModal from "./delete-modal"
import axiosInstance from "@/lib/config/axios"
import { Pagination } from "@/utils/pagination"
import { ItemSkeleton } from "@/utils/loaders"
import CreateAnnouncementOffcanvas from "./create-announcement-offcanvas"
import EditAnnouncementOffcanvas from "./edit-announcement-offcanvas"
import AnnouncementViewOffcanvas from "./announcement-view-offcanvas"
import toast from "react-hot-toast"

// data type
type Announcement = {
    _id: string
    title: string
    description: string
    image: string
    readMoreButton: string
    isActive: boolean
    slug: string
    createdAt: string
    updatedAt: string
}

type ApiResponse = {
    announcement: Announcement[]
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

export default function AnnouncementList() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [tableLoading, setTableLoading] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 1,
    })

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean
        announcement: Announcement | null
        loading: boolean
    }>({
        announcement: null,
        isOpen: false,
        loading: false,
    })

    const [editModal, setEditModal] = useState<{
        isOpen: boolean
        announcement: Announcement | null
    }>({
        isOpen: false,
        announcement: null,
    })

    const [viewModal, setViewModal] = useState<{
        isOpen: boolean
        announcementId: string | null
    }>({
        isOpen: false,
        announcementId: null,
    })

    useEffect(() => {
        loadAnnouncements()
    }, [currentPage, searchTerm])

    const loadAnnouncements = async () => {
        try {
            setTableLoading(true)
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: "10",
                ...(searchTerm && { search: searchTerm }),
            })
            const res = await axiosInstance.get(`/admin/announcements?${params}`)
            const data: ApiResponse = res.data
            setAnnouncements(data.announcement)
            setPagination(data.pagination)
        } catch (error) {
            console.log("Failed to load announcements:", error)
        } finally {
            setTableLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentPage(1)
        loadAnnouncements()
    }

    const openEditModal = (announcement: Announcement) => {
        setEditModal({
            isOpen: true,
            announcement,
        })
    }

    const closeEditModal = () => {
        setEditModal({
            isOpen: false,
            announcement: null,
        })
    }

    const openViewModal = (announcementId: string) => {
        setViewModal({
            isOpen: true,
            announcementId,
        })
    }

    const closeViewModal = () => {
        setViewModal({
            isOpen: false,
            announcementId: null,
        })
    }

    const handleAnnouncementUpdated = () => {
        loadAnnouncements()
    }

    const handleDelete = async () => {
        if (!deleteModal.announcement) return
        try {
            setDeleteModal((prev) => ({ ...prev, loading: true }))
            await axiosInstance.delete(`/admin/announcements/${deleteModal.announcement._id}`)
            toast.success("Announcement deleted successfully")
            setDeleteModal({ isOpen: false, announcement: null, loading: false })
            loadAnnouncements()
        } catch (error: any) {
            toast.error(error.response.data.error || "Failed to delete announcement")
        }
    }

    const openDeleteModal = (announcement: Announcement) => {
        setDeleteModal({
            isOpen: true,
            announcement,
            loading: false,
        })
    }

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            announcement: null,
            loading: false,
        })
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleAnnouncementCreated = () => {
        loadAnnouncements()
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
                            <FiFileText className="h-6 w-6 text-gray-500" />
                            <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
                        </div>
                        <p className="text-gray-600">Manage and organize your announcements</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full">
                            {pagination.total} {pagination.total === 1 ? "announcement" : "announcements"}
                        </span>
                    </div>
                </div>

                {/* Announcements Table Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Table Header */}
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <form onSubmit={handleSearch} className="relative flex-1 sm:max-w-sm">
                                <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search announcements..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cardinal-pink-900 outline-none focus:border-cardinal-pink-900 transition-colors text-sm sm:text-base"
                                />
                            </form>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="inline-flex items-center justify-center px-4 py-2.5 sm:py-2 text-sm sm:text-base bg-cardinal-pink-950 text-white font-medium rounded-lg hover:bg-cardinal-pink-900 transition-colors whitespace-nowrap"
                            >
                                <FiPlus className="mr-2 h-4 w-4" />
                                Add Announcement
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
                                                Announcement
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
                                        {announcements.map((announcement) => (
                                            <tr key={announcement._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-start space-x-4">
                                                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                                            {announcement.image && announcement.image !== "dummy link" ? (
                                                                <img
                                                                    src={announcement.image || "/placeholder.svg"}
                                                                    alt={announcement.title}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <FiFileText className="h-6 w-6 text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-medium text-gray-900 truncate">{announcement.title}</div>
                                                            <div className="text-sm text-gray-500 line-clamp-2">{announcement.description}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${announcement.isActive
                                                            ? "bg-green-100 text-green-800 border-green-200"
                                                            : "bg-red-100 text-red-800 border-red-200"
                                                            }`}
                                                    >
                                                        {announcement.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatDate(announcement.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Dropdown
                                                        trigger={
                                                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                                <FiMoreHorizontal className="h-4 w-4" />
                                                            </button>
                                                        }
                                                    >
                                                        <DropdownItem onClick={() => openViewModal(announcement._id)}>
                                                            <FiEye className="mr-2 h-4 w-4" />
                                                            View
                                                        </DropdownItem>
                                                        <DropdownItem onClick={() => openEditModal(announcement)}>
                                                            <FiEdit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownItem>
                                                        <DropdownItem
                                                            onClick={() => openDeleteModal(announcement)}
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
                                {announcements.map((announcement) => (
                                    <div
                                        key={announcement._id}
                                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-3 flex-1">
                                                <div className="flex items-start space-x-3">
                                                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                                        {announcement.image && announcement.image !== "dummy link" ? (
                                                            <img
                                                                src={announcement.image || "/placeholder.svg"}
                                                                alt={announcement.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <FiFileText className="h-4 w-4 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-gray-900 truncate">{announcement.title}</div>
                                                        <div className="text-sm text-gray-500 line-clamp-2">{announcement.description}</div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${announcement.isActive
                                                            ? "bg-green-100 text-green-800 border-green-200"
                                                            : "bg-red-100 text-red-800 border-red-200"
                                                            }`}
                                                    >
                                                        {announcement.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                    <span className="text-xs text-gray-500">{formatDate(announcement.createdAt)}</span>
                                                </div>
                                            </div>
                                            <Dropdown
                                                trigger={
                                                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <FiMoreHorizontal className="h-4 w-4" />
                                                    </button>
                                                }
                                            >
                                                <DropdownItem onClick={() => openViewModal(announcement._id)}>
                                                    <FiEye className="mr-2 h-4 w-4" />
                                                    View
                                                </DropdownItem>
                                                <DropdownItem onClick={() => openEditModal(announcement)}>
                                                    <FiEdit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownItem>
                                                <DropdownItem
                                                    onClick={() => openDeleteModal(announcement)}
                                                    className="text-red-600 hover:bg-red-50"
                                                >
                                                    <FiTrash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownItem>
                                            </Dropdown>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Empty State */}
                            {announcements.length === 0 && (
                                <div className="text-center py-12">
                                    <FiFileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No announcements found</h3>
                                    <p className="text-gray-500 mb-4">
                                        {searchTerm
                                            ? "No announcements match your search criteria."
                                            : "Get started by adding your first announcement."}
                                    </p>
                                    {!searchTerm && (
                                        <button
                                            onClick={() => setIsCreateModalOpen(true)}
                                            className="inline-flex items-center px-4 py-2 text-sm bg-cardinal-pink-950 text-white font-medium rounded-lg hover:bg-cardinal-pink-900 transition-colors"
                                        >
                                            <FiPlus className="mr-2 h-4 w-4" />
                                            Add Announcement
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Pagination */}
                {!tableLoading && announcements.length > 0 && (
                    <div className="flex justify-center">
                        <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={handlePageChange} />
                    </div>
                )}
            </div>

            {/* Modals */}
            {isCreateModalOpen && (
                <CreateAnnouncementOffcanvas
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onAnnouncementCreated={handleAnnouncementCreated}
                />
            )}

            {editModal.isOpen && editModal.announcement && (
                <EditAnnouncementOffcanvas
                    isOpen={editModal.isOpen}
                    onClose={closeEditModal}
                    announcement={editModal.announcement}
                    onAnnouncementUpdated={handleAnnouncementUpdated}
                />
            )}

            {deleteModal.isOpen && deleteModal.announcement && (
                <DeleteModal
                    isOpen={deleteModal.isOpen}
                    onClose={closeDeleteModal}
                    onConfirm={handleDelete}
                    loading={deleteModal.loading}
                />
            )}

            {viewModal.isOpen && viewModal.announcementId && (
                <AnnouncementViewOffcanvas
                    isOpen={viewModal.isOpen}
                    onClose={closeViewModal}
                    announcementId={viewModal.announcementId}
                />
            )}
        </div>
    )
}
