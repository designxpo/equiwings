import Event from '@/components/pages/event-details';
import React from 'react'

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    return (
        <Event slug={slug} />
    )
}

