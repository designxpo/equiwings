"use client"
import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
    FiPlus,
    FiSearch,
    FiEye,
    FiEdit,
    FiTrash2,
    FiMoreHorizontal,
    FiFileText,
    FiUser,
    FiCalendar,
} from "react-icons/fi"
import CreateBlogOffcanvas from "./create-blog-offcanvas"
import EditBlogOffcanvas from "./edit-blog-offcanvas"
import ViewBlogOffcanvas from "./view-blog-offcanvas"
import DeleteBlogModal from "./delete-blog-modal"
import { Pagination } from "@/utils/pagination"
import axiosInstance from "@/lib/config/axios"
import { ItemSkeleton } from "@/utils/loaders"
import toast from "react-hot-toast"

// Blog type to match the API model
type Blog = {
    _id: string
    title: string
    slug: string
    content: string
    featuredImage?: string
    author: {
        _id: string
        firstName: string
        lastName: string
        email: string
    }
    category: string
    status: "draft" | "published"
    publishedAt?: string
    createdAt: string
    updatedAt: string
}

type PaginationData = {
    page: number
    limit: number
    pages: number
    total: number
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
    href?: string
    className?: string
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

export default function BlogsList() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const [blogs, setBlogs] = useState<Blog[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [pagination, setPagination] = useState<PaginationData>({
        page: 1,
        limit: 10,
        pages: 1,
        total: 0,
    })

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [editModal, setEditModal] = useState<{
        isOpen: boolean
        blog: Blog | null
    }>({
        isOpen: false,
        blog: null,
    })
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean
        blog: Blog | null
        loading: boolean
    }>({
        blog: null,
        isOpen: false,
        loading: false,
    })
    const [viewModal, setViewModal] = useState<{
        isOpen: boolean
        blog: Blog | null
    }>({
        isOpen: false,
        blog: null,
    })

    // Debounce search
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

    useEffect(() => {
        loadBlogs()
    }, [pagination.page])

    useEffect(() => {
        if (searchTimeout) {
            clearTimeout(searchTimeout)
        }
        const timeout = setTimeout(() => {
            if (pagination.page === 1) {
                loadBlogs()
            } else {
                setPagination((prev) => ({ ...prev, page: 1 }))
            }
        }, 500)
        setSearchTimeout(timeout)
        return () => {
            if (timeout) {
                clearTimeout(timeout)
            }
        }
    }, [searchTerm])

    // Handle blogId query parameter
    useEffect(() => {
        const blogId = searchParams.get("blogId")

        if (blogId && blogs.length > 0) {
            // Find the blog with matching ID
            const blog = blogs.find((b) => b._id === blogId)

            if (blog) {
                // Open the view modal with the found blog
                setViewModal({
                    isOpen: true,
                    blog: blog,
                })

                // Remove the blogId from URL to prevent reopening on refresh
                const url = new URL(window.location.href)
                url.searchParams.delete("blogId")
                router.replace(url.pathname + url.search, { scroll: false })
            } else {
                // Blog not found in current page
                toast.error(`Blog with ID ${blogId} not found`)

                // Remove the blogId from URL
                const url = new URL(window.location.href)
                url.searchParams.delete("blogId")
                router.replace(url.pathname + url.search, { scroll: false })
            }
        }
    }, [blogs, searchParams, router])

    const loadBlogs = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                ...(searchTerm && { search: searchTerm }),
            })
            const response = await axiosInstance.get(`/admin/blogs?${params}`)
            setBlogs(response.data.blogs)
            setPagination(response.data.pagination)
        } catch (error) {
            console.error("Failed to load blogs:", error)
        } finally {
            setLoading(false)
        }
    }

    const handlePageChange = (page: number) => {
        setPagination((prev) => ({ ...prev, page }))
    }

    const handleDelete = async () => {
        if (!deleteModal.blog) return

        try {
            setDeleteModal((prev) => ({ ...prev, loading: true }))
            await axiosInstance.delete(`/admin/blogs/${deleteModal.blog._id}`)
            // Reload blogs after deletion
            loadBlogs()
            toast.success("Blog deleted successfully")
            setDeleteModal({ isOpen: false, blog: null, loading: false })
        } catch (error: any) {
            toast.error(error.response.data.error || "Failed to delete blog")
            setDeleteModal((prev) => ({ ...prev, loading: false }))
        }
    }

    const openViewModal = (blog: Blog) => {
        setViewModal({
            isOpen: true,
            blog,
        })
    }

    const closeViewModal = () => {
        setViewModal({
            isOpen: false,
            blog: null,
        })
    }

    const openEditModal = (blog: Blog) => {
        setEditModal({
            isOpen: true,
            blog,
        })
    }

    const closeEditModal = () => {
        setEditModal({
            isOpen: false,
            blog: null,
        })
    }

    const openDeleteModal = (blog: Blog) => {
        setDeleteModal({
            isOpen: true,
            blog,
            loading: false,
        })
    }

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            blog: null,
            loading: false,
        })
    }

    const handleBlogCreated = () => {
        // Refresh the blogs list after creating a new blog
        loadBlogs()
    }

    const handleBlogUpdated = () => {
        // Refresh the blogs list after updating a blog
        loadBlogs()
    }

    const getCategoryBadgeClasses = (category: string) => {
        switch (category.toLowerCase()) {
            case "technology":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "lifestyle":
                return "bg-green-100 text-green-800 border-green-200"
            case "business":
                return "bg-purple-100 text-purple-800 border-purple-200"
            case "health":
                return "bg-orange-100 text-orange-800 border-orange-200"
            case "travel":
                return "bg-pink-100 text-pink-800 border-pink-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const truncateContent = (content: string, maxLength = 100) => {
        if (content.length <= maxLength) return content
        return content.substring(0, maxLength) + "..."
    }

    return (
        <div className="bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between sm:px-4 lg:px-0">
                    <div className="space-y-1 mb-5">
                        <div className="flex items-center gap-2">
                            <FiFileText className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Blogs</h1>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600">Manage and organize your blog posts</p>
                    </div>
                    <div className="flex items-center gap-2 mb-3 md:mb-0">
                        <span className="inline-flex px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full">
                            {pagination.total} {pagination.total === 1 ? "blog" : "blogs"}
                        </span>
                    </div>
                </div>

                {/* Blogs Table Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sm:mx-6 lg:mx-0">
                    {/* Table Header */}
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="relative flex-1 sm:max-w-sm">
                                <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search blogs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cardinal-pink-900 outline-none focus:border-cardinal-pink-900 transition-colors text-sm sm:text-base"
                                />
                            </div>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="inline-flex items-center justify-center px-4 py-2.5 sm:py-2 text-sm sm:text-base bg-cardinal-pink-950 text-white font-medium rounded-lg hover:bg-cardinal-pink-900 transition-colors whitespace-nowrap"
                            >
                                <FiPlus className="mr-2 h-4 w-4" />
                                Add Blog
                            </button>
                        </div>
                    </div>

                    {/* Table Content */}
                    {loading ? (
                        <ItemSkeleton />
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Blog
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Author
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Published
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {blogs.map((blog) => (
                                            <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <Image
                                                                src={blog.featuredImage || "/placeholder.svg"}
                                                                alt={blog.title}
                                                                width={40}
                                                                height={40}
                                                                className="h-10 w-10 rounded-lg object-cover"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="text-sm font-medium text-gray-900 overflow-hidden overflow-ellipsis whitespace-nowrap max-w-xs">{blog.title}</div>
                                                            {/* <div className="text-sm text-gray-500 overflow-hidden overflow-ellipsis whitespace-nowrap" style={{ maxWidth: "250px" }} dangerouslySetInnerHTML={{ __html: blog.content }} /> */}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-2">
                                                        <FiUser className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm text-gray-900">
                                                            {blog.author.firstName} {blog.author.lastName}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getCategoryBadgeClasses(blog.category)}`}
                                                    >
                                                        {blog.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${blog.status === "published"
                                                            ? "bg-green-100 text-green-800 border-green-200"
                                                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                                                            }`}
                                                    >
                                                        {blog.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {blog.publishedAt ? formatDate(blog.publishedAt) : "Not published"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Dropdown
                                                        trigger={
                                                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                                <FiMoreHorizontal className="h-4 w-4" />
                                                            </button>
                                                        }
                                                    >
                                                        <DropdownItem onClick={() => openViewModal(blog)}>
                                                            <FiEye className="mr-2 h-4 w-4" />
                                                            View
                                                        </DropdownItem>
                                                        <DropdownItem onClick={() => openEditModal(blog)}>
                                                            <FiEdit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownItem>
                                                        <DropdownItem
                                                            onClick={() => openDeleteModal(blog)}
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
                                {blogs.map((blog) => (
                                    <div
                                        key={blog._id}
                                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-3 flex-1">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex-shrink-0 h-12 w-12">
                                                        <Image
                                                            src={blog.featuredImage || "/placeholder.svg"}
                                                            alt={blog.title}
                                                            width={48}
                                                            height={48}
                                                            className="h-12 w-12 rounded-lg object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{blog.title}</div>
                                                        <div className="text-sm text-gray-500 overflow-hidden overflow-ellipsis whitespace-nowrap" style={{ maxWidth: '250px' }} dangerouslySetInnerHTML={{ __html: blog.content }} />
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <FiUser className="h-3 w-3 text-gray-400" />
                                                            <span className="text-xs text-gray-600">
                                                                {blog.author.firstName} {blog.author.lastName}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getCategoryBadgeClasses(blog.category)}`}
                                                    >
                                                        {blog.category}
                                                    </span>
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${blog.status === "published"
                                                            ? "bg-green-100 text-green-800 border-green-200"
                                                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                                                            }`}
                                                    >
                                                        {blog.status}
                                                    </span>
                                                    {blog.publishedAt && (
                                                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border bg-blue-100 text-blue-800 border-blue-200">
                                                            <FiCalendar className="h-3 w-3 mr-1" />
                                                            {formatDate(blog.publishedAt)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <Dropdown
                                                trigger={
                                                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <FiMoreHorizontal className="h-4 w-4" />
                                                    </button>
                                                }
                                            >
                                                <DropdownItem onClick={() => openViewModal(blog)}>
                                                    <FiEye className="mr-2 h-4 w-4" />
                                                    View
                                                </DropdownItem>
                                                <DropdownItem onClick={() => openEditModal(blog)}>
                                                    <FiEdit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownItem>
                                                <DropdownItem onClick={() => openDeleteModal(blog)} className="text-red-600 hover:bg-red-50">
                                                    <FiTrash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownItem>
                                            </Dropdown>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Empty State */}
                            {blogs.length === 0 && (
                                <div className="text-center py-12">
                                    <FiFileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No blogs found</h3>
                                    <p className="text-gray-500 mb-4">
                                        {searchTerm ? "No blogs match your search criteria." : "Get started by adding your first blogs."}
                                    </p>
                                    {!searchTerm && (
                                        <button
                                            onClick={() => setIsCreateModalOpen(true)}
                                            className="inline-flex items-center px-4 py-2 text-sm bg-cardinal-pink-950 text-white font-medium rounded-lg hover:bg-cardinal-pink-900 transition-colors"
                                        >
                                            <FiPlus className="mr-2 h-4 w-4" />
                                            Add Blog
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Pagination */}
                            <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={handlePageChange} />
                        </>
                    )}
                </div>

                {/* Modals */}
                {isCreateModalOpen && (
                    <CreateBlogOffcanvas
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        onBlogCreated={handleBlogCreated}
                    />
                )}

                {/* View Modal */}
                {viewModal.isOpen && (
                    <ViewBlogOffcanvas isOpen={viewModal.isOpen} onClose={closeViewModal} blog={viewModal.blog} />
                )}

                {/* Edit Modal */}
                {editModal.isOpen && (
                    <EditBlogOffcanvas
                        isOpen={editModal.isOpen}
                        onClose={closeEditModal}
                        blog={editModal.blog}
                        onBlogUpdated={handleBlogUpdated}
                    />
                )}

                {/* Delete Modal */}
                {deleteModal.isOpen && (
                    <DeleteBlogModal
                        isOpen={deleteModal.isOpen}
                        onClose={closeDeleteModal}
                        onConfirm={handleDelete}
                        loading={deleteModal.loading}
                        blogTitle={deleteModal.blog?.title}
                    />
                )}
            </div>
        </div>
    )
}
