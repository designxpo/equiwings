"use client"
import type React from "react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiMoreHorizontal, FiUsers } from "react-icons/fi"
import DeleteModal from "./delete-modal"
import axiosInstance from "@/lib/config/axios"
import { Pagination } from "@/utils/pagination"
import { ItemSkeleton } from "@/utils/loaders"
import CreateUserOffcanvas from "./create-offcanvas"
import EditUserOffcanvas from "./edit-offcanvas"
import UserProfileOffcanvas from "./user-profile-offcanvas"
import toast from "react-hot-toast"

// data type
type User = {
    _id: string
    firstName: string
    lastName: string
    email: string
    countryCode: string
    phoneNumber: string
    role: {
        _id: string
        name: string
        description: string
    }
    isEmailVerified: boolean
    createdAt: string
    updatedAt: string
}

type ApiResponse = {
    users: User[]
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

export default function UsersList() {
    const [users, setUsers] = useState<User[]>([])
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
        user: User | null
        loading: boolean
    }>({
        user: null,
        isOpen: false,
        loading: false,
    })

    // Updated editModal state to store user object instead of userId
    const [editModal, setEditModal] = useState<{
        isOpen: boolean
        user: User | null
    }>({
        isOpen: false,
        user: null,
    })

    // Add profile modal state
    const [profileModal, setProfileModal] = useState<{
        isOpen: boolean
        userId: string | null
    }>({
        isOpen: false,
        userId: null,
    })

    useEffect(() => {
        loadUsers()
    }, [currentPage, searchTerm])

    const loadUsers = async () => {
        try {
            setTableLoading(true)

            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: "10",
                ...(searchTerm && { search: searchTerm }),
            })

            const res = await axiosInstance.get(`/admin/users?${params}`)
            const data: ApiResponse = res.data

            setUsers(data.users)
            setPagination(data.pagination)
        } catch (error) {
            console.log("Failed to load users:", error)
        } finally {
            setTableLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentPage(1)
        loadUsers()
    }

    // Updated to pass user object instead of userId
    const openEditModal = (user: User) => {
        setEditModal({
            isOpen: true,
            user,
        })
    }

    const closeEditModal = () => {
        setEditModal({
            isOpen: false,
            user: null,
        })
    }

    // Profile modal handlers
    const openProfileModal = (userId: string) => {
        setProfileModal({
            isOpen: true,
            userId,
        })
    }

    const closeProfileModal = () => {
        setProfileModal({
            isOpen: false,
            userId: null,
        })
    }

    const handleUserUpdated = () => {
        // Refresh the users list after updating a user
        loadUsers()
    }

    const handleDelete = async () => {
        if (!deleteModal.user) return

        try {
            setDeleteModal((prev) => ({ ...prev, loading: true }))
            await axiosInstance.delete(`/admin/users/${deleteModal.user._id}`)
            toast.success("User deleted successfully")
            // Close modal
            setDeleteModal({ isOpen: false, user: null, loading: false })

            // Reload users to update pagination
            loadUsers()
        } catch (error: any) {
            toast.error(error.response.data.error || "Failed to delete user")
        }
    }

    const openDeleteModal = (user: User) => {
        setDeleteModal({
            isOpen: true,
            user,
            loading: false,
        })
    }

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            user: null,
            loading: false,
        })
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleUserCreated = () => {
        // Refresh the users list after creating a new user
        loadUsers()
    }

    return (
        <div className="bg-gray-50">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Page Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <FiUsers className="h-6 w-6 text-gray-500" />
                            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                        </div>
                        <p className="text-gray-600">Manage and organize your customers</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full">
                            {pagination.total} {pagination.total === 1 ? "customer" : "customers"}
                        </span>
                    </div>
                </div>

                {/* Users Table Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Table Header - Always visible */}
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <form onSubmit={handleSearch} className="relative flex-1 sm:max-w-sm">
                                <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
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
                                Add Customer
                            </button>
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
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contact
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="space-y-1">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.firstName} {user.lastName}
                                                        </div>
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {user.countryCode} {user.phoneNumber}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${user.isEmailVerified
                                                            ? "bg-green-100 text-green-800 border-green-200"
                                                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                                                            }`}
                                                    >
                                                        {user.isEmailVerified ? "Verified" : "Pending"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Dropdown
                                                        trigger={
                                                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                                <FiMoreHorizontal className="h-4 w-4" />
                                                            </button>
                                                        }
                                                    >
                                                        <DropdownItem onClick={() => openProfileModal(user._id)}>
                                                            <FiEye className="mr-2 h-4 w-4" />
                                                            View
                                                        </DropdownItem>
                                                        <DropdownItem onClick={() => openEditModal(user)}>
                                                            <FiEdit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownItem>
                                                        <DropdownItem
                                                            onClick={() => openDeleteModal(user)}
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
                                {users.map((user) => (
                                    <div
                                        key={user._id}
                                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-3 flex-1">
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {user.firstName} {user.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {user.countryCode} {user.phoneNumber}
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${user.isEmailVerified
                                                            ? "bg-green-100 text-green-800 border-green-200"
                                                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                                                            }`}
                                                    >
                                                        {user.isEmailVerified ? "Verified" : "Pending"}
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
                                                <DropdownItem onClick={() => openProfileModal(user._id)}>
                                                    <FiEye className="mr-2 h-4 w-4" />
                                                    View
                                                </DropdownItem>
                                                <DropdownItem onClick={() => openEditModal(user)}>
                                                    <FiEdit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownItem>
                                                <DropdownItem
                                                    onClick={() => openDeleteModal(user)}
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
                            {users.length === 0 && (
                                <div className="text-center py-12">
                                    <FiUsers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
                                    <p className="text-gray-500 mb-4">
                                        {searchTerm ? "No users match your search criteria." : "Get started by adding your first user."}
                                    </p>
                                    {!searchTerm && (
                                        <button
                                            onClick={() => setIsCreateModalOpen(true)}
                                            className="inline-flex items-center px-4 py-2 text-sm bg-cardinal-pink-950 text-white font-medium rounded-lg hover:bg-cardinal-pink-900 transition-colors"
                                        >
                                            <FiPlus className="mr-2 h-4 w-4" />
                                            Add User
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Pagination */}
                {!tableLoading && users.length > 0 && (
                    <div className="flex justify-center">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.pages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>

            {/* Modals */}
            {isCreateModalOpen && (
                <CreateUserOffcanvas
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onUserCreated={handleUserCreated}
                />
            )}

            {editModal.isOpen && editModal.user && (
                <EditUserOffcanvas
                    isOpen={editModal.isOpen}
                    onClose={closeEditModal}
                    user={editModal.user}
                    onUserUpdated={handleUserUpdated}
                />
            )}

            {deleteModal.isOpen && deleteModal.user && (
                <DeleteModal
                    isOpen={deleteModal.isOpen}
                    onClose={closeDeleteModal}
                    onConfirm={handleDelete}
                    loading={deleteModal.loading}
                />
            )}

            {profileModal.isOpen && profileModal.userId && (
                <UserProfileOffcanvas
                    isOpen={profileModal.isOpen}
                    onClose={closeProfileModal}
                    userId={profileModal.userId}
                />
            )}
        </div>
    )
}