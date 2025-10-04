// src/app/sports-and-events/page.tsx
import SportsAndEvents from '@/components/pages/sports-and-events'
import React from 'react'
import { Metadata } from 'next'
import { getSeoData } from '@/utils/seo'

export async function generateMetadata(): Promise<Metadata> {
    const seo = await getSeoData('sports-and-events');
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

const SportsAndEventsPage = () => {
    return (
        <>
            <SportsAndEvents />
        </>
    )
}

export default SportsAndEventsPage