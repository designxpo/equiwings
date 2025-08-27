"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2, FiMoreHorizontal, FiPackage, FiStar } from "react-icons/fi"
import CreateProductOffcanvas from "./create-product-offcanvas"
import EditProductOffcanvas from "./edit-product-offcanvas"
import DeleteProductModal from "./delete-product-modal"
import ViewProductOffcanvas from "./view-product-offcanvas"
import axiosInstance from "@/lib/config/axios"
import { ItemSkeleton } from "@/utils/loaders"
import { Pagination } from "@/utils/pagination"
import toast from "react-hot-toast"

// Updated Product type to match Mongoose model
type Product = {
    _id: string
    productId: string
    name: string
    description: string
    price: number
    category: string
    sizes: string[]
    colors: string[]
    quantity: number
    mainImage: string
    additionalImages: string[]
    ratings: {
        average: number
        count: number
    }
    reviews: {
        reviewerName: string
        rating: number
        comment: string
        createdAt: string
    }[]
    isActive: boolean
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

export default function ProductsList() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const [products, setProducts] = useState<Product[]>([])
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
        product: Product | null
    }>({
        isOpen: false,
        product: null,
    })
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean
        product: Product | null
        loading: boolean
    }>({
        product: null,
        isOpen: false,
        loading: false,
    })
    const [viewModal, setViewModal] = useState<{
        isOpen: boolean
        product: Product | null
    }>({
        isOpen: false,
        product: null,
    })

    // Debounce search
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

    useEffect(() => {
        loadProducts()
    }, [pagination.page])

    useEffect(() => {
        if (searchTimeout) {
            clearTimeout(searchTimeout)
        }

        const timeout = setTimeout(() => {
            if (pagination.page === 1) {
                loadProducts()
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

    // Handle productId query parameter
    useEffect(() => {
        const productId = searchParams.get('productId')

        if (productId && products.length > 0) {
            // Find the product with matching productId
            const product = products.find(p => p.productId === productId)

            if (product) {
                // Open the view modal with the found product
                setViewModal({
                    isOpen: true,
                    product: product,
                })

                // Remove the productId from URL to prevent reopening on refresh
                const url = new URL(window.location.href)
                url.searchParams.delete('productId')
                router.replace(url.pathname + url.search, { scroll: false })
            } else {
                // Product not found in current page, might need to search or show error
                toast.error(`Product with ID ${productId} not found`)

                // Remove the productId from URL
                const url = new URL(window.location.href)
                url.searchParams.delete('productId')
                router.replace(url.pathname + url.search, { scroll: false })
            }
        }
    }, [products, searchParams, router])

    const loadProducts = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                ...(searchTerm && { search: searchTerm }),
            })

            const response = await axiosInstance.get(`/admin/products?${params}`)
            setProducts(response.data.products)
            setPagination(response.data.pagination)
        } catch (error) {
            console.error("Failed to load products:", error)
        } finally {
            setLoading(false)
        }
    }

    const handlePageChange = (page: number) => {
        setPagination((prev) => ({ ...prev, page }))
    }

    const handleDelete = async () => {
        if (!deleteModal.product) return

        try {
            setDeleteModal((prev) => ({ ...prev, loading: true }))
            await axiosInstance.delete(`/admin/products/${deleteModal.product._id}`)
            // Reload products after deletion
            loadProducts()
            toast.success("Product deleted successfully")
            setDeleteModal({ isOpen: false, product: null, loading: false })
        } catch (error: any) {
            toast.error(error.response.data.error || "Failed to delete product")
            setDeleteModal((prev) => ({ ...prev, loading: false }))
        }
    }

    const openViewModal = (product: Product) => {
        setViewModal({
            isOpen: true,
            product,
        })
    }

    const closeViewModal = () => {
        setViewModal({
            isOpen: false,
            product: null,
        })
    }

    const openEditModal = (product: Product) => {
        setEditModal({
            isOpen: true,
            product,
        })
    }

    const closeEditModal = () => {
        setEditModal({
            isOpen: false,
            product: null,
        })
    }

    const openDeleteModal = (product: Product) => {
        setDeleteModal({
            isOpen: true,
            product,
            loading: false,
        })
    }

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            product: null,
            loading: false,
        })
    }

    const handleProductCreated = () => {
        // Refresh the products list after creating a new product
        loadProducts()
    }

    const handleProductUpdated = () => {
        // Refresh the products list after updating a product
        loadProducts()
    }

    const getCategoryBadgeClasses = (category: string) => {
        switch (category.toLowerCase()) {
            case "tshirts":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "pants":
                return "bg-green-100 text-green-800 border-green-200"
            case "caps":
                return "bg-purple-100 text-purple-800 border-purple-200"
            case "bags":
                return "bg-orange-100 text-orange-800 border-orange-200"
            case "accessories":
                return "bg-pink-100 text-pink-800 border-pink-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    return (
        <div className="bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between sm:px-4 lg:px-0">
                    <div className="space-y-1 mb-5">
                        <div className="flex items-center gap-2">
                            <FiPackage className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Products</h1>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600">Manage and organize your products</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full">
                            {pagination.total} {pagination.total === 1 ? "product" : "products"}
                        </span>
                    </div>
                </div>

                {/* Products Table Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sm:mx-6 lg:mx-0">
                    {/* Table Header */}
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="relative flex-1 sm:max-w-sm">
                                <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
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
                                Add Product
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
                                                Product Id
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Stock
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
                                        {products.map((product) => (
                                            <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-sm font-semibold`}
                                                    >
                                                        {product.productId}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <Image
                                                                src={"/placeholder.svg"}
                                                                alt={product.name}
                                                                width={40}
                                                                height={40}
                                                                className="h-10 w-10 rounded-lg object-cover"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                            <div className="text-sm text-gray-500 max-w-xs truncate">{product.description}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getCategoryBadgeClasses(product.category)}`}
                                                    >
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    ${product.price.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.quantity}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${product.isActive
                                                            ? "bg-green-100 text-green-800 border-green-200"
                                                            : "bg-red-100 text-red-800 border-red-200"
                                                            }`}
                                                    >
                                                        {product.isActive ? "Active" : "Inactive"}
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
                                                        <DropdownItem onClick={() => openViewModal(product)}>
                                                            <FiEye className="mr-2 h-4 w-4" />
                                                            View
                                                        </DropdownItem>
                                                        <DropdownItem onClick={() => openEditModal(product)}>
                                                            <FiEdit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownItem>
                                                        <DropdownItem
                                                            onClick={() => openDeleteModal(product)}
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
                                {products.map((product) => (
                                    <div
                                        key={product._id}
                                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-3 flex-1">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex-shrink-0 h-12 w-12">
                                                        <Image
                                                            src={"/placeholder.svg"}
                                                            alt={product.name}
                                                            width={48}
                                                            height={48}
                                                            className="h-12 w-12 rounded-lg object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{product.name}</div>
                                                        <div className="text-sm text-gray-500">{product.description}</div>
                                                        <div className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getCategoryBadgeClasses(product.category)}`}
                                                    >
                                                        {product.category}
                                                    </span>
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${product.isActive
                                                            ? "bg-green-100 text-green-800 border-green-200"
                                                            : "bg-red-100 text-red-800 border-red-200"
                                                            }`}
                                                    >
                                                        {product.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full border bg-blue-100 text-blue-800 border-blue-200">
                                                        Stock: {product.quantity}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex items-center space-x-1">
                                                        <FiStar className="h-4 w-4 text-yellow-400 fill-current" />
                                                        <span className="text-sm text-gray-600">
                                                            {product.ratings.average.toFixed(1)} ({product.ratings.count})
                                                        </span>
                                                    </div>
                                                    <div className="flex space-x-1">
                                                        {product.colors.slice(0, 3).map((color, index) => (
                                                            <div
                                                                key={index}
                                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                                style={{ backgroundColor: color }}
                                                            />
                                                        ))}
                                                        {product.colors.length > 3 && (
                                                            <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Dropdown
                                                trigger={
                                                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <FiMoreHorizontal className="h-4 w-4" />
                                                    </button>
                                                }
                                            >
                                                <DropdownItem onClick={() => openViewModal(product)}>
                                                    <FiEye className="mr-2 h-4 w-4" />
                                                    View
                                                </DropdownItem>
                                                <DropdownItem onClick={() => openEditModal(product)}>
                                                    <FiEdit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownItem>
                                                <DropdownItem onClick={() => openDeleteModal(product)} className="text-red-600 hover:bg-red-50">
                                                    <FiTrash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownItem>
                                            </Dropdown>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Empty State */}
                            {products.length === 0 && (
                                <div className="text-center py-12">
                                    <FiPackage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
                                    <p className="text-gray-500 mb-4">
                                        {searchTerm ? "No products match your search criteria." : "Get started by adding your first products."}
                                    </p>
                                    {!searchTerm && (
                                        <button
                                            onClick={() => setIsCreateModalOpen(true)}
                                            className="inline-flex items-center px-4 py-2 text-sm bg-cardinal-pink-950 text-white font-medium rounded-lg hover:bg-cardinal-pink-900 transition-colors"
                                        >
                                            <FiPlus className="mr-2 h-4 w-4" />
                                            Add Product
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
                    <CreateProductOffcanvas
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        onProductCreated={handleProductCreated}
                    />
                )}

                {/* View Modal */}
                {viewModal.isOpen && (
                    <ViewProductOffcanvas isOpen={viewModal.isOpen} onClose={closeViewModal} product={viewModal.product} />
                )}

                {/* Edit Modal */}
                {editModal.isOpen && (
                    <EditProductOffcanvas
                        isOpen={editModal.isOpen}
                        onClose={closeEditModal}
                        product={editModal.product}
                        onProductUpdated={handleProductUpdated}
                    />
                )}

                {/* Delete Modal */}
                {deleteModal.isOpen && (
                    <DeleteProductModal
                        isOpen={deleteModal.isOpen}
                        onClose={closeDeleteModal}
                        onConfirm={handleDelete}
                        loading={deleteModal.loading}
                        productName={deleteModal.product?.name}
                    />
                )}
            </div>
        </div>
    )
}