"use client"
import type React from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import axiosInstance from "@/lib/config/axios"
import { Pagination } from "@/utils/pagination"
import { ItemSkeleton } from "@/utils/loaders"
import { useState, useEffect, useRef } from "react"
import { EditEventOffcanvas } from "./edit-event-offcanvas"
import { EventViewOffcanvas } from "./event-view-offcanvas"
import { CreateEventOffcanvas } from "./create-event-offcanvas"
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiMoreHorizontal, FiCalendar, FiFilter } from "react-icons/fi"
import DeleteModal from "./delete-modal"

// data type
type Event = {
    _id: string
    title: string
    description: string
    slug: string
    content: string
    bannerImage?: string
    date?: string
    location?: string
    isPastEvent: boolean
    eventImages?: string[]
    order?: number
    isActive: boolean
    createdAt: string
    updatedAt: string
}

type ApiResponse = {
    events: Event[]
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

export default function EventList() {
    const [events, setEvents] = useState<Event[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [tableLoading, setTableLoading] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [statusFilter, setStatusFilter] = useState<string>("")
    const [eventTypeFilter, setEventTypeFilter] = useState<string>("")
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 1,
    })

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean
        event: Event | null
        loading: boolean
    }>({
        event: null,
        isOpen: false,
        loading: false,
    })

    const [editModal, setEditModal] = useState<{
        isOpen: boolean
        event: Event | null
    }>({
        isOpen: false,
        event: null,
    })

    const [viewModal, setViewModal] = useState<{
        isOpen: boolean
        eventId: string | null
    }>({
        isOpen: false,
        eventId: null,
    })

    useEffect(() => {
        loadEvents()
    }, [currentPage, searchTerm, statusFilter, eventTypeFilter])

    const loadEvents = async () => {
        try {
            setTableLoading(true)
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: "10",
                ...(searchTerm && { search: searchTerm }),
                ...(statusFilter && { isActive: statusFilter }),
                ...(eventTypeFilter && { isPastEvent: eventTypeFilter }),
            })
            const res = await axiosInstance.get(`/admin/events?${params}`)
            const data: ApiResponse = res.data
            setEvents(data.events)
            setPagination(data.pagination)
        } catch (error: any) {
            console.error("Failed to load events:", error)
            toast.error(error.response?.data?.error || "Failed to load events")
        } finally {
            setTableLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentPage(1)
        loadEvents()
    }

    const openEditModal = (event: Event) => {
        setEditModal({
            isOpen: true,
            event,
        })
    }

    const closeEditModal = () => {
        setEditModal({
            isOpen: false,
            event: null,
        })
    }

    const openViewModal = (eventId: string) => {
        setViewModal({
            isOpen: true,
            eventId,
        })
    }

    const closeViewModal = () => {
        setViewModal({
            isOpen: false,
            eventId: null,
        })
    }

    const handleEventUpdated = () => {
        loadEvents()
    }

    const handleDelete = async () => {
        if (!deleteModal.event) return
        try {
            setDeleteModal((prev) => ({ ...prev, loading: true }))
            const response = await axiosInstance.delete(`/admin/events/${deleteModal.event._id}`)
            toast.success(response.data.message || "Event deleted successfully")
            setDeleteModal({ isOpen: false, event: null, loading: false })
            loadEvents()
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to delete event")
            setDeleteModal((prev) => ({ ...prev, loading: false }))
        }
    }

    const openDeleteModal = (event: Event) => {
        setDeleteModal({
            isOpen: true,
            event,
            loading: false,
        })
    }

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            event: null,
            loading: false,
        })
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleEventCreated = () => {
        loadEvents()
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
                            <FiCalendar className="h-6 w-6 text-gray-500" />
                            <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
                        </div>
                        <p className="text-gray-600">Manage your events and activities</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full">
                            {pagination.total} {pagination.total === 1 ? "event" : "events"}
                        </span>
                    </div>
                </div>

                {/* Event Table Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Table Header */}
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex flex-col gap-3 sm:gap-4">
                            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                                <form onSubmit={handleSearch} className="relative flex-1 sm:max-w-sm">
                                    <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search events..."
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
                                    Add Event
                                </button>
                            </div>
                            {/* Filters */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => {
                                            setStatusFilter(e.target.value)
                                            setCurrentPage(1)
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cardinal-pink-900 outline-none focus:border-cardinal-pink-900 transition-colors text-sm"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <select
                                        value={eventTypeFilter}
                                        onChange={(e) => {
                                            setEventTypeFilter(e.target.value)
                                            setCurrentPage(1)
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cardinal-pink-900 outline-none focus:border-cardinal-pink-900 transition-colors text-sm"
                                    >
                                        <option value="">All Events</option>
                                        <option value="false">Upcoming Events</option>
                                        <option value="true">Past Events</option>
                                    </select>
                                </div>
                            </div>
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
                                                Event
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date & Location
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
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
                                        {events.map((item) => (
                                            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-start space-x-4">
                                                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                                            <img
                                                                src={item.bannerImage || "/placeholder.svg"}
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
                                                            <div className="text-xs text-gray-500 truncate">{item.slug}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{item.date || "TBA"}</div>
                                                    <div className="text-xs text-gray-500">{item.location || "TBA"}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${item.isPastEvent
                                                            ? "bg-gray-100 text-gray-800 border-gray-200"
                                                            : "bg-blue-100 text-blue-800 border-blue-200"
                                                            }`}
                                                    >
                                                        {item.isPastEvent ? "Past" : "Upcoming"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full border bg-gray-100 text-gray-800 border-gray-200">
                                                        {item.order || 0}
                                                    </span>
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
                                {events.map((item) => (
                                    <div
                                        key={item._id}
                                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-3 flex-1">
                                                <div className="flex items-start space-x-3">
                                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                                        <img
                                                            src={item.bannerImage || "/placeholder.svg"}
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
                                                        <div className="text-xs text-gray-500 truncate">{item.slug}</div>
                                                        <div className="text-xs text-gray-600 mt-1">{item.date || "TBA"}</div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${item.isPastEvent
                                                            ? "bg-gray-100 text-gray-800 border-gray-200"
                                                            : "bg-blue-100 text-blue-800 border-blue-200"
                                                            }`}
                                                    >
                                                        {item.isPastEvent ? "Past" : "Upcoming"}
                                                    </span>
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full border bg-gray-100 text-gray-800 border-gray-200">
                                                        Order: {item.order || 0}
                                                    </span>
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${item.isActive
                                                            ? "bg-green-100 text-green-800 border-green-200"
                                                            : "bg-red-100 text-red-800 border-red-200"
                                                            }`}
                                                    >
                                                        {item.isActive ? "Active" : "Inactive"}
                                                    </span>
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
                            {events.length === 0 && (
                                <div className="text-center py-12">
                                    <FiCalendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No events found</h3>
                                    <p className="text-gray-500 mb-4">
                                        {searchTerm || statusFilter || eventTypeFilter
                                            ? "No events match your search criteria."
                                            : "Get started by adding your first event."}
                                    </p>
                                    {!searchTerm && !statusFilter && !eventTypeFilter && (
                                        <button
                                            onClick={() => setIsCreateModalOpen(true)}
                                            className="inline-flex items-center px-4 py-2 text-sm bg-cardinal-pink-950 text-white font-medium rounded-lg hover:bg-cardinal-pink-900 transition-colors"
                                        >
                                            <FiPlus className="mr-2 h-4 w-4" />
                                            Add Event
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Pagination */}
                {!tableLoading && events.length > 0 && (
                    <div className="flex justify-center">
                        <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={handlePageChange} />
                    </div>
                )}
            </div>

            {/* Modals */}
            {isCreateModalOpen && (
                <CreateEventOffcanvas
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onEventCreated={handleEventCreated}
                />
            )}

            {editModal.isOpen && editModal.event && (
                <EditEventOffcanvas
                    isOpen={editModal.isOpen}
                    onClose={closeEditModal}
                    event={editModal.event}
                    onEventUpdated={handleEventUpdated}
                />
            )}

            {deleteModal.isOpen && deleteModal.event && (
                <DeleteModal
                    isOpen={deleteModal.isOpen}
                    onClose={closeDeleteModal}
                    onConfirm={handleDelete}
                    loading={deleteModal.loading}
                />
            )}

            {viewModal.isOpen && viewModal.eventId && (
                <EventViewOffcanvas isOpen={viewModal.isOpen} onClose={closeViewModal} eventId={viewModal.eventId} />
            )}
        </div>
    )
}