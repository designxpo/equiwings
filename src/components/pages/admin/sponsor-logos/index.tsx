"use client"
import type React from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import DeleteModal from "./delete-modal"
import axiosInstance from "@/lib/config/axios"
import { Pagination } from "@/utils/pagination"
import { ItemSkeleton } from "@/utils/loaders"
import { useState, useEffect, useRef } from "react"
import EditLogoOffcanvas from "./edit"
import LogoViewOffcanvas from "./view"
import CreateLogoOffcanvas from "./create"
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiMoreHorizontal, FiImage, FiExternalLink } from "react-icons/fi"

// data type
type SponsorLogo = {
    _id: string
    name: string
    logo_url: string
    website: string
    description: string
    type: 'partner' | 'sponsor'
    status: 'active' | 'inactive'
    order: number
    createdAt: string
    updatedAt: string
}

type ApiResponse = {
    data: SponsorLogo[]
    pagination: {
        page: number
        limit: number
        total: number
        pages: number
    }
}

// Custom Dropdown Component (reused from news)
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

const LogoTypeBadge = ({ type }: { type: 'partner' | 'sponsor' }) => {
    if (type === 'sponsor') {
        return (
            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                <FiExternalLink className="mr-1 h-3 w-3" />
                Sponsor
            </span>
        )
    }
    return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            <FiImage className="mr-1 h-3 w-3" />
            Partner
        </span>
    )
}

const StatusBadge = ({ status }: { status: 'active' | 'inactive' }) => {
    return (
        <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${status === 'active'
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-red-100 text-red-800 border-red-200"
                }`}
        >
            {status === 'active' ? "Active" : "Inactive"}
        </span>
    )
}

export default function SponsorLogoList() {
    const [logos, setLogos] = useState<SponsorLogo[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [tableLoading, setTableLoading] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [typeFilter, setTypeFilter] = useState<string>("")
    const [statusFilter, setStatusFilter] = useState<string>("")
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 1,
    })

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean
        logo: SponsorLogo | null
        loading: boolean
    }>({
        logo: null,
        isOpen: false,
        loading: false,
    })

    const [editModal, setEditModal] = useState<{
        isOpen: boolean
        logo: SponsorLogo | null
    }>({
        isOpen: false,
        logo: null,
    })

    const [viewModal, setViewModal] = useState<{
        isOpen: boolean
        logoId: string | null
    }>({
        isOpen: false,
        logoId: null,
    })

    useEffect(() => {
        loadLogos()
    }, [currentPage, searchTerm, typeFilter, statusFilter])

    const loadLogos = async () => {
        try {
            setTableLoading(true)
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: "10",
                ...(searchTerm && { search: searchTerm }),
                ...(typeFilter && { type: typeFilter }),
                ...(statusFilter && { status: statusFilter }),
            })
            const res = await axiosInstance.get(`/admin/sponsor-logos?${params}`)
            const data: ApiResponse = res.data
            setLogos(data.data)
            setPagination(data.pagination)
        } catch (error: any) {
            console.error("Failed to load logos:", error)
            toast.error(error.response?.data?.error || "Failed to load sponsor logos")
        } finally {
            setTableLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentPage(1)
        loadLogos()
    }

    const openEditModal = (logo: SponsorLogo) => {
        setEditModal({
            isOpen: true,
            logo,
        })
    }

    const closeEditModal = () => {
        setEditModal({
            isOpen: false,
            logo: null,
        })
    }

    const openViewModal = (logoId: string) => {
        setViewModal({
            isOpen: true,
            logoId,
        })
    }

    const closeViewModal = () => {
        setViewModal({
            isOpen: false,
            logoId: null,
        })
    }

    const handleLogoUpdated = () => {
        loadLogos()
    }

    const handleDelete = async () => {
        if (!deleteModal.logo) return
        try {
            setDeleteModal((prev) => ({ ...prev, loading: true }))
            await axiosInstance.delete(`/admin/sponsor-logos/${deleteModal.logo._id}`)
            toast.success("Sponsor logo deleted successfully")
            setDeleteModal({ isOpen: false, logo: null, loading: false })
            loadLogos()
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to delete logo")
            setDeleteModal((prev) => ({ ...prev, loading: false }))
        }
    }

    const openDeleteModal = (logo: SponsorLogo) => {
        setDeleteModal({
            isOpen: true,
            logo,
            loading: false,
        })
    }

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            logo: null,
            loading: false,
        })
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleLogoCreated = () => {
        loadLogos()
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const renderLogoImage = (logo: SponsorLogo) => {
        return (
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                {logo.logo_url ? (
                    <img
                        src={logo.logo_url || "/placeholder.svg"}
                        alt={logo.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                        }}
                    />
                ) : (
                    <FiImage className="h-6 w-6 text-gray-400" />
                )}
            </div>
        )
    }

    return (
        <div className="bg-gray-50">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Page Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <FiImage className="h-6 w-6 text-gray-500" />
                            <h1 className="text-2xl font-bold text-gray-900">Sponsor Logos</h1>
                        </div>
                        <p className="text-gray-600">Manage your partner and sponsor logos</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full">
                            {pagination.total} {pagination.total === 1 ? "logo" : "logos"}
                        </span>
                    </div>
                </div>

                {/* Logo Table Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Table Header */}
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col sm:flex-row gap-3 flex-1">
                                <form onSubmit={handleSearch} className="relative flex-1 sm:max-w-sm">
                                    <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search logos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cardinal-pink-900 outline-none focus:border-cardinal-pink-900 transition-colors text-sm sm:text-base"
                                    />
                                </form>
                                {/* <select
                                    value={typeFilter}
                                    onChange={(e) => {
                                        setTypeFilter(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                    className="px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cardinal-pink-900 outline-none focus:border-cardinal-pink-900 transition-colors text-sm sm:text-base"
                                >
                                    <option value="">All Types</option>
                                    <option value="partner">Partner</option>
                                    <option value="sponsor">Sponsor</option>
                                </select> */}
                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                    className="px-3 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cardinal-pink-900 outline-none focus:border-cardinal-pink-900 transition-colors text-sm sm:text-base"
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="inline-flex items-center justify-center px-4 py-2.5 sm:py-2 text-sm sm:text-base bg-cardinal-pink-950 text-white font-medium rounded-lg hover:bg-cardinal-pink-900 transition-colors whitespace-nowrap"
                            >
                                <FiPlus className="mr-2 h-4 w-4" />
                                Add Logo
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
                                                Logo
                                            </th>
                                            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th> */}
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order
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
                                        {logos.map((logo) => (
                                            <tr key={logo._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-start space-x-4">
                                                        {renderLogoImage(logo)}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-medium text-gray-900 truncate">{logo.name}</div>
                                                            <div className="text-sm text-gray-500 truncate">{logo.website}</div>
                                                            <div className="text-sm text-gray-500 line-clamp-2">{logo.description}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                {/* <td className="px-6 py-4 whitespace-nowrap">
                                                    <LogoTypeBadge type={logo.type} />
                                                </td> */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {logo.order}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <StatusBadge status={logo.status} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatDate(logo.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Dropdown
                                                        trigger={
                                                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                                <FiMoreHorizontal className="h-4 w-4" />
                                                            </button>
                                                        }
                                                    >
                                                        <DropdownItem onClick={() => openViewModal(logo._id)}>
                                                            <FiEye className="mr-2 h-4 w-4" />
                                                            View
                                                        </DropdownItem>
                                                        <DropdownItem onClick={() => openEditModal(logo)}>
                                                            <FiEdit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownItem>
                                                        <DropdownItem
                                                            onClick={() => openDeleteModal(logo)}
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
                                {logos.map((logo) => (
                                    <div
                                        key={logo._id}
                                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-3 flex-1">
                                                <div className="flex items-start space-x-3">
                                                    {renderLogoImage(logo)}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-gray-900 truncate">{logo.name}</div>
                                                        <div className="text-sm text-gray-500 truncate">{logo.website}</div>
                                                        <div className="text-sm text-gray-500 line-clamp-2">{logo.description}</div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {/* <LogoTypeBadge type={logo.type} /> */}
                                                    <StatusBadge status={logo.status} />
                                                    <span className="text-xs text-gray-500">Order: {logo.order}</span>
                                                    <span className="text-xs text-gray-500">{formatDate(logo.createdAt)}</span>
                                                </div>
                                            </div>
                                            <Dropdown
                                                trigger={
                                                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <FiMoreHorizontal className="h-4 w-4" />
                                                    </button>
                                                }
                                            >
                                                <DropdownItem onClick={() => openViewModal(logo._id)}>
                                                    <FiEye className="mr-2 h-4 w-4" />
                                                    View
                                                </DropdownItem>
                                                <DropdownItem onClick={() => openEditModal(logo)}>
                                                    <FiEdit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownItem>
                                                <DropdownItem onClick={() => openDeleteModal(logo)} className="text-red-600 hover:bg-red-50">
                                                    <FiTrash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownItem>
                                            </Dropdown>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Empty State */}
                            {logos.length === 0 && (
                                <div className="text-center py-12">
                                    <FiImage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No logos found</h3>
                                    <p className="text-gray-500 mb-4">
                                        {searchTerm || typeFilter || statusFilter
                                            ? "No logos match your search criteria."
                                            : "Get started by adding your first sponsor logo."}
                                    </p>
                                    {!searchTerm && !typeFilter && !statusFilter && (
                                        <button
                                            onClick={() => setIsCreateModalOpen(true)}
                                            className="inline-flex items-center px-4 py-2 text-sm bg-cardinal-pink-950 text-white font-medium rounded-lg hover:bg-cardinal-pink-900 transition-colors"
                                        >
                                            <FiPlus className="mr-2 h-4 w-4" />
                                            Add Logo
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Pagination */}
                {!tableLoading && logos.length > 0 && (
                    <div className="flex justify-center">
                        <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={handlePageChange} />
                    </div>
                )}
            </div>

            {/* Modals */}
            {isCreateModalOpen && (
                <CreateLogoOffcanvas
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onLogoCreated={handleLogoCreated}
                />
            )}

            {editModal.isOpen && editModal.logo && (
                <EditLogoOffcanvas
                    isOpen={editModal.isOpen}
                    onClose={closeEditModal}
                    logo={editModal.logo}
                    onLogoUpdated={handleLogoUpdated}
                />
            )}

            {deleteModal.isOpen && deleteModal.logo && (
                <DeleteModal
                    isOpen={deleteModal.isOpen}
                    onClose={closeDeleteModal}
                    onConfirm={handleDelete}
                    loading={deleteModal.loading}
                />
            )}

            {viewModal.isOpen && viewModal.logoId && (
                <LogoViewOffcanvas isOpen={viewModal.isOpen} onClose={closeViewModal} logoId={viewModal.logoId} />
            )}
        </div>
    )
}