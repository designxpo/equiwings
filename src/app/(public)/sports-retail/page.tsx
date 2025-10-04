// src/app/sports-retail/page.tsx
import ProductList from '@/components/pages/sports-retail'
import React from 'react'
import { Metadata } from 'next'
import { getSeoData } from '@/utils/seo'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoData('sports-retail');
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
    <ProductList />
  )
}