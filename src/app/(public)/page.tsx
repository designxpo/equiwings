// src/app/page.tsx
import HomePage from '@/components/pages/home'
import React from 'react'
import { Metadata } from 'next'
import { getSeoData } from '@/utils/seo';

// This function runs server-side to fetch SEO for this page
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData('home');
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

export default function Page() {
  return <HomePage />
}
