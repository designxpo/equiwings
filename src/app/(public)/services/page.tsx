// src/app/services/page.tsx
import Services from '@/components/pages/services'
import React from 'react'
import { Metadata } from 'next'
import { getSeoData } from '@/utils/seo'

export async function generateMetadata(): Promise<Metadata> {
    const seo = await getSeoData('services');
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
        <Services />
    )
}