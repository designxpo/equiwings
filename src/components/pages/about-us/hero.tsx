import React from 'react'

export default function Hero() {
    return (
        <section className="h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat">
            <video autoPlay loop muted className="absolute inset-0 w-full h-full -z-50 object-cover">
                <source src="/assets/videos/home/hero/equiwings.mp4" type="video/mp4" />
            </video>
            <div className="container mx-auto p-4 text-center">
                <h1 className="text-5xl font-bold text-white">About Us</h1>
                <p className="text-xl text-white mt-4">
                    Equiwings was founded with a simple goal to make equestrian sports accessible, safe, and fun for riders of all ages and ambitions. We blend professionalism with passion creating India&#39;s premier equestrian destination. Equiwings is most comprehensive equestrian ecosystem.
                </p>
            </div>
        </section>
    )
}

