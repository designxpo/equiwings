"use client"
import axiosInstance from '@/lib/config/axios';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

// Type definitions based on your MongoDB model
interface Author {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface Blog {
    _id: string;
    title: string;
    slug: string;
    featuredImage?: string;
    author: Author;
    content: string;
    category: string;
    status: "draft" | "published" | "archived";
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
}

interface BlogsApiResponse {
    blogs: Blog[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

const BlogCards: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pagination, setPagination] = useState<BlogsApiResponse['pagination'] | null>(null);

    const limit = 6; // Show 6 blogs per page

    useEffect(() => {
        fetchBlogs();
    }, [currentPage, search]);

    const fetchBlogs = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            // Build query parameters
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: limit.toString(),
                status: 'published',
                sortBy: 'publishedAt',
                sortOrder: 'desc'
            });

            if (search) params.append('search', search);

            // Make API call using axiosInstance
            const response = await axiosInstance.get(`/admin/blogs?${params.toString()}`);
            const data: BlogsApiResponse = response.data;

            setBlogs(data.blogs);
            setPagination(data.pagination);
        } catch (err: any) {
            console.error('Fetch blogs error:', err);
            const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch blogs';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchBlogs();
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const truncateText = (text: string, maxLength: number): string => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const stripHtmlTags = (html: string): string => {
        return html.replace(/<[^>]*>/g, '');
    };

    const getImageUrl = (featuredImage?: string): string => {
        return featuredImage || `https://picsum.photos/400/250?random=${Math.random()}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cardinal-pink-800 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading blogs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                        <div className="text-red-600 mb-4">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="font-medium">{error}</p>
                        </div>
                        <button
                            onClick={fetchBlogs}
                            className="bg-cardinal-pink-800 text-white px-4 py-2 rounded-lg hover:bg-cardinal-pink-950 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[url('/assets/images/bg-4.webp')] bg-cover bg-center bg-no-repeat py-8 sm:py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-4">
                        Recent Blog Posts
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-cardinal-pink-950 to-cardinal-pink-800 rounded-full mx-auto mb-6"></div>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                        Discover insights, stories, and updates from our team of experts and thought leaders.
                    </p>
                </div>

                {/* Blog Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {blogs.map((blog: Blog) => (
                        <article
                            key={blog._id}
                            className="group relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200 bg-white"
                        >
                            {/* Full Image Container */}
                            <div className="relative h-96 sm:h-[420px] lg:h-[350px] overflow-hidden">
                                <img
                                    src={getImageUrl(blog.featuredImage)}
                                    alt={blog.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `https://picsum.photos/400/600?random=${blog._id}`;
                                    }}
                                />

                                {/* Base Dark Gradient Overlay - Always visible but lighter */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent group-hover:from-black/80 group-hover:via-black/50 transition-all duration-500"></div>

                                {/* Category Badge - Top */}
                                {blog.category && (
                                    <div className="absolute top-4 left-4 z-20">
                                        <span className="bg-cardinal-pink-800 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                                            {blog.category}
                                        </span>
                                    </div>
                                )}

                                {/* Static Content - Always visible */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-20">
                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2 transform transition-transform duration-500 ease-out group-hover:-translate-y-2">
                                        <Link href={`/blogs/${blog.slug}`} className="hover:text-cardinal-pink-300 transition-colors">
                                            {truncateText(blog.title, 60)}
                                        </Link>
                                    </h3>
                                    <p className="text-cardinal-pink-300 font-semibold mb-2 sm:mb-4 text-base sm:text-lg">
                                        {formatDate(blog.publishedAt || blog.createdAt)}
                                    </p>
                                    
                                    {/* Animated Blog Content - Only this slides up */}
                                    <div className="relative h-0 overflow-hidden group-hover:h-auto transition-all duration-500 ease-out">
                                        <p className="text-white/90 leading-relaxed text-sm sm:text-base line-clamp-3 sm:line-clamp-none mb-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                            {truncateText(stripHtmlTags(blog.content), 120)}
                                        </p>
                                    </div>
                                    
                                    {/* Read More Button - Always visible */}
                                    <div className="flex justify-start">
                                        <Link
                                            href={`/blogs/${blog.slug}`}
                                            className="inline-flex items-center bg-white/90 backdrop-blur-sm text-cardinal-pink-800 hover:bg-cardinal-pink-800 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-lg transform hover:scale-105"
                                        >
                                            Read More
                                            <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Empty State */}
                {blogs.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <div className="max-w-md mx-auto">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-600 mb-2">No blog posts found</h3>
                            <p className="text-gray-500">
                                {search ? `No results for "${search}"` : 'Check back later for new content'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                    <div className="mt-12">
                        <div className="flex justify-center items-center space-x-2">
                            {/* Previous Button */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === 1
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-cardinal-pink-800 hover:bg-cardinal-pink-50 border border-cardinal-pink-200'
                                    }`}
                            >
                                Previous
                            </button>

                            {/* Page Numbers */}
                            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === page
                                        ? 'bg-cardinal-pink-800 text-white'
                                        : 'bg-white text-cardinal-pink-800 hover:bg-cardinal-pink-50 border border-cardinal-pink-200'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            {/* Next Button */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === pagination.pages}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === pagination.pages
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-cardinal-pink-800 hover:bg-cardinal-pink-50 border border-cardinal-pink-200'
                                    }`}
                            >
                                Next
                            </button>
                        </div>

                        {/* Pagination Info */}
                        <div className="text-center mt-4 text-gray-600">
                            <p>
                                Page {pagination.page} of {pagination.pages}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogCards;