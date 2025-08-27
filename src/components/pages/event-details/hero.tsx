import React from 'react'

export default function Hero({ slug }: { slug: string }) {
    return (
        <section className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[url('/assets/images/about-us/hero.jpg')]">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-60"></div>

            {/* Content */}
            <div className="relative container mx-auto p-4 text-center">
                <h1 className="text-5xl font-bold text-cardinal-pink-400">{slug}</h1>
                <p className="text-xl text-white mt-4">
                    Explore the Polo Event’s Across the Globe
                </p>
                <p className='md:text-md text-sm text-white mt-8 uppercase'>
                    Event Date : 6 JUNE, 2025
                </p>
            </div>
        </section>

    )
}


