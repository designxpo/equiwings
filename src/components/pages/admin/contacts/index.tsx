"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { FiSearch, FiEye, FiTrash2, FiMoreHorizontal, FiMail } from "react-icons/fi"
import DeleteModal from "./delete-modal"
import axiosInstance from "@/lib/config/axios"
import { Pagination } from "@/utils/pagination"
import { ItemSkeleton } from "@/utils/loaders"
import ContactViewOffcanvas from "./contact-view-offcanvas"
import toast from "react-hot-toast"

// data type
type Contact = {
    _id: string
    firstName: string
    lastName?: string
    email: string
    countryCode?: string
    phoneNumber?: string
    message: string
    createdAt: string
    updatedAt: string
}

type ApiResponse = {
    contacts: Contact[]
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
    className = "",
}: {
    children: React.ReactNode
    onClick?: () => void
    className?: string
}) => {
    const baseClasses = "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
    const classes = `${baseClasses} ${className}`

    return (
        <button onClick={onClick} className={`${classes} w-full text-left`}>
            {children}
        </button>
    )
}

export default function ContactsList() {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [tableLoading, setTableLoading] = useState(false)
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 1,
    })

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean
        contact: Contact | null
        loading: boolean
    }>({
        contact: null,
        isOpen: false,
        loading: false,
    })

    // Add view modal state
    const [viewModal, setViewModal] = useState<{
        isOpen: boolean
        contact: Contact | null
    }>({
        isOpen: false,
        contact: null,
    })

    useEffect(() => {
        loadContacts()
    }, [currentPage, searchTerm])

    const loadContacts = async () => {
        try {
            setTableLoading(true)
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: "10",
                ...(searchTerm && { search: searchTerm }),
            })
            const res = await axiosInstance.get(`/admin/contacts?${params}`)
            const data: ApiResponse = res.data
            setContacts(data.contacts)
            setPagination(data.pagination)
        } catch (error) {
            console.log("Failed to load contacts:", error)
        } finally {
            setTableLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentPage(1)
        loadContacts()
    }

    // View modal handlers
    const openViewModal = (contact: Contact) => {
        setViewModal({
            isOpen: true,
            contact,
        })
    }

    const closeViewModal = () => {
        setViewModal({
            isOpen: false,
            contact: null,
        })
    }

    const handleDelete = async () => {
        if (!deleteModal.contact) return
        try {
            setDeleteModal((prev) => ({ ...prev, loading: true }))
            await axiosInstance.delete(`/admin/contacts/${deleteModal.contact._id}`)
            toast.success("Contact deleted successfully")
            // Close modal
            setDeleteModal({ isOpen: false, contact: null, loading: false })
            // Reload contacts to update pagination
            loadContacts()
        } catch (error: any) {
            toast.error(error.response.data.error || "Failed to delete contact")
        }
    }

    const openDeleteModal = (contact: Contact) => {
        setDeleteModal({
            isOpen: true,
            contact,
            loading: false,
        })
    }

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            contact: null,
            loading: false,
        })
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
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
                            <FiMail className="h-6 w-6 text-gray-500" />
                            <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
                        </div>
                        <p className="text-gray-600">View and manage contact form submissions</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full">
                            {pagination.total} {pagination.total === 1 ? "message" : "messages"}
                        </span>
                    </div>
                </div>

                {/* Contacts Table Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Table Header - Always visible */}
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <form onSubmit={handleSearch} className="relative flex-1 sm:max-w-sm">
                                <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search contacts..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cardinal-pink-900 outline-none focus:border-cardinal-pink-900 transition-colors text-sm sm:text-base"
                                />
                            </form>
                        </div>
                    </div>

                    {/* Table Content - Show skeleton only when table is loading */}
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
                                                Contact
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Phone
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Message Preview
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {contacts.map((contact) => (
                                            <tr key={contact._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="space-y-1">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {contact.firstName} {contact.lastName || ""}
                                                        </div>
                                                        <div className="text-sm text-gray-500">{contact.email}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {contact.countryCode && contact.phoneNumber
                                                        ? `${contact.countryCode} ${contact.phoneNumber}`
                                                        : "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatDate(contact.createdAt)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 max-w-xs truncate">{contact.message}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Dropdown
                                                        trigger={
                                                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                                <FiMoreHorizontal className="h-4 w-4" />
                                                            </button>
                                                        }
                                                    >
                                                        <DropdownItem onClick={() => openViewModal(contact)}>
                                                            <FiEye className="mr-2 h-4 w-4" />
                                                            View
                                                        </DropdownItem>
                                                        <DropdownItem
                                                            onClick={() => openDeleteModal(contact)}
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
                                {contacts.map((contact) => (
                                    <div
                                        key={contact._id}
                                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-3 flex-1">
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {contact.firstName} {contact.lastName || ""}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{contact.email}</div>
                                                    {contact.countryCode && contact.phoneNumber && (
                                                        <div className="text-sm text-gray-500">
                                                            {contact.countryCode} {contact.phoneNumber}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    <div className="font-medium">Message:</div>
                                                    <div className="truncate">{contact.message}</div>
                                                </div>
                                                <div className="text-xs text-gray-500">{formatDate(contact.createdAt)}</div>
                                            </div>
                                            <Dropdown
                                                trigger={
                                                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <FiMoreHorizontal className="h-4 w-4" />
                                                    </button>
                                                }
                                            >
                                                <DropdownItem onClick={() => openViewModal(contact)}>
                                                    <FiEye className="mr-2 h-4 w-4" />
                                                    View
                                                </DropdownItem>
                                                <DropdownItem onClick={() => openDeleteModal(contact)} className="text-red-600 hover:bg-red-50">
                                                    <FiTrash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownItem>
                                            </Dropdown>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Empty State */}
                            {contacts.length === 0 && (
                                <div className="text-center py-12">
                                    <FiMail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No contacts found</h3>
                                    <p className="text-gray-500 mb-4">
                                        {searchTerm
                                            ? "No contacts match your search criteria."
                                            : "No contact messages have been received yet."}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Pagination */}
                {!tableLoading && contacts.length > 0 && (
                    <div className="flex justify-center">
                        <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={handlePageChange} />
                    </div>
                )}
            </div>

            {/* Modals */}
            {deleteModal.isOpen && deleteModal.contact && (
                <DeleteModal
                    isOpen={deleteModal.isOpen}
                    onClose={closeDeleteModal}
                    onConfirm={handleDelete}
                    loading={deleteModal.loading}
                />
            )}

            {viewModal.isOpen && viewModal.contact && (
                <ContactViewOffcanvas isOpen={viewModal.isOpen} onClose={closeViewModal} contact={viewModal.contact} />
            )}
        </div>
    )
}
