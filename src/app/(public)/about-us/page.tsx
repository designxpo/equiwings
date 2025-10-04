// src/app/about-us/page.tsx
import AboutUs from '@/components/pages/about-us'
import React from 'react'
import { Metadata } from 'next'
import { getSeoData } from '@/utils/seo'

export async function generateMetadata(): Promise<Metadata> {
    const seo = await getSeoData('about-us');
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

export default function page() {
    return (
        <AboutUs />
    )
}