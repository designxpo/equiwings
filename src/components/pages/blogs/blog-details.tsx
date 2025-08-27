"use client"
import axiosInstance from '@/lib/config/axios'
import React, { useState, useEffect } from 'react'

interface Author {
    firstName?: string
    lastName?: string
    email?: string
}

interface Blog {
    title: string
    description?: string
    content?: string
    createdAt: string
    updatedAt?: string
    status: 'published' | 'draft' | string
    featuredImage?: string
    author?: Author
    tags?: string[]
    category?: string
    readingTime?: number
}

interface BlogDetailsProps {
    slug: string
}

const BlogDetails: React.FC<BlogDetailsProps> = ({ slug }) => {
    const [blog, setBlog] = useState<Blog | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBlog = async () => {
            if (!slug) {
                setError('Blog slug is required')
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                const response = await axiosInstance.get(`/customers/blogs/${slug}`)
                setBlog(response.data.blog)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchBlog()
    }, [slug])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cardinal-pink-800"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    <h2 className="font-bold text-lg mb-2">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    if (!blog) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700">Blog not found</h2>
                    <p className="text-gray-500 mt-2">The blog you're looking for doesn't exist.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mt-6 md:mt-16 mx-auto px-4 py-8">
            {/* Blog Header */}
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-5">
                    {blog.title}
                </h1>

                {/* Author and Date Info */}
                <div className="flex items-center text-gray-600 mb-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-cardinal-pink-800 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                            {blog.author?.firstName?.[0]}{blog.author?.lastName?.[0]}
                        </div>
                        <div>
                            <p className="font-medium">
                                {blog.author?.firstName} {blog.author?.lastName}
                            </p>
                        </div>
                    </div>
                    <div className="ml-auto text-right">
                        <p className="text-sm">
                            Published: {new Date(blog.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Featured Image */}
                {blog.featuredImage && (
                    <div className="mb-6">
                        <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="w-full h-64 object-cover rounded-lg shadow-md"
                        />
                    </div>
                )}
            </header>

            {/* Blog Content */}
            <article className="prose prose-lg max-w-none">
                {blog.content ? (
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                ) : (
                    <p className="text-gray-500 italic">No content available</p>
                )}
            </article>
        </div>
    )
}

export default BlogDetails
