"use client"
import React from 'react'
import useScrollAnimation from '@/hooks/use-animation'

export default function Hero() {
    const visibleElements = useScrollAnimation()

    return (
        <section className="h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative">
            <video autoPlay loop muted className="absolute inset-0 w-full h-full -z-50 object-cover">
                <source src="/assets/videos/about/about.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/40" />
            <div className="max-w-5xl mx-auto p-4 text-center z-20">
                <h1 
                    id="hero-title"
                    data-animate
                    className={`text-5xl font-bold text-cardinal-pink-400 transition-all duration-1000 transform ${
                        visibleElements.has('hero-title') 
                            ? 'translate-y-0 opacity-100' 
                            : 'translate-y-8 opacity-0'
                    }`}
                >
                    About Us
                </h1>
                <p 
                    id="hero-description"
                    data-animate
                    className={`text-xl text-white mt-4 transition-all duration-1000 delay-300 transform ${
                        visibleElements.has('hero-description') 
                            ? 'translate-y-0 opacity-100' 
                            : 'translate-y-8 opacity-0'
                    }`}
                >
                    Equiwings was founded with a simple goal to make equestrian sports accessible, safe, and fun for riders of all ages and ambitions. We blend professionalism with passion creating India's premier equestrian destination. Equiwings is most comprehensive equestrian ecosystem.
                </p>
            </div>
        </section>
    )
}