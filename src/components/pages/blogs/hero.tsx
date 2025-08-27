import React from 'react'

export default function Hero() {
    return (
        <section className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[url('/assets/images/about-us/hero.jpg')]">
            {/* Fixed responsive overlay */}
            <div className="absolute inset-0 bg-black/50"></div>
            
            <div className="relative  flex flex-col justify-center items-center px-4 xl:px-0 text-left space-y-4 md:space-y-8 lg:space-y-12 mt-10 md:mt-20">
                {/* Featured tag */}
                <div className="inline-block">
                    <span className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm md:text-base font-semibold text-white">
                        Latest Stories
                    </span>
                </div>
                
                {/* Main heading */}
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center leading-tight">
                    Insights from the World of 
                    <span className="block text-cardinal-pink-400 mt-2">Sports & Excellence</span>
                </h1>
                
                {/* Description */}
                <p className="text-base md:text-xl lg:text-2xl text-gray-200 mt-4 md:mt-6 leading-relaxed text-center max-w-4xl">
                    Discover stories of triumph, innovation, and dedication from athletes, coaches, and sports enthusiasts. 
                    Stay updated with the latest trends, training techniques, and inspiring journeys that shape the sporting landscape.
                </p>
            </div>
        </section>
    )
}