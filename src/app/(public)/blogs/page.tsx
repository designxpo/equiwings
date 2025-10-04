// src/app/blogs/page.tsx
import PublicBlogs from '@/components/pages/blogs'
import React from 'react'
import { Metadata } from 'next'
import { getSeoData } from '@/utils/seo'

export async function generateMetadata(): Promise<Metadata> {
    const seo = await getSeoData('blogs');
    return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        openGraph: {
            title: seo.title,
            description: seo.description,
        },
    }
}

const Blogs = () => {
    return (
        <PublicBlogs />
    )
}

export default Blogs