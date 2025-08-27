import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

// Pagination Component
export const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
}: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}) => {
    const pages = []
    const showPages = 5
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2))
    const endPage = Math.min(totalPages, startPage + showPages - 1)

    if (endPage - startPage + 1 < showPages) {
        startPage = Math.max(1, endPage - showPages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
    }

    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FiChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                </button>
                <div className="flex items-center gap-1">
                    {startPage > 1 && (
                        <>
                            <button
                                onClick={() => onPageChange(1)}
                                className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                1
                            </button>
                            {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
                        </>
                    )}
                    {pages.map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-1 text-sm rounded-lg transition-colors ${page === currentPage
                                ? "bg-cardinal-pink-950 text-white"
                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                </div>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                    <FiChevronRight className="h-4 w-4 ml-1" />
                </button>
            </div>
            <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
            </div>
        </div>
    )
}
