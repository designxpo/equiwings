// src/app/gallery/page.tsx
import Gallery from '@/components/pages/gallery'
import React from 'react'
import { Metadata } from 'next'
import { getSeoData } from '@/utils/seo'

export async function generateMetadata(): Promise<Metadata> {
    const seo = await getSeoData('gallery');
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

const GalleryPage = () => {
    return (
        <Gallery />
    )
}

export default GalleryPage