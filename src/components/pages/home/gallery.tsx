"use client";
import { motion } from "framer-motion"
import Link from "next/link";
import React from 'react'

export default function Gallery() {
    const headerVariants = {
        hidden: { opacity: 0, y: -30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
            },
        },
    }

    return (
        <section className="py-20 relative bg-[url(/assets/images/bg-2.webp)] overflow-hidden w-full bg-center bg-no-repeat bg-cover">
            <motion.h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-center text-white" variants={headerVariants}>
                Gallery
            </motion.h2>
            {/* Main Grid Container */}
            <div className="max-w-screen-xl mx-auto py-24 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-10 gap-2">

                {/* Top Left Large Image */}
                <div className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-4 row-span-2">
                    <img src="/assets/images/home/gallery/1.jpg" alt="Gallery Image 1" className="w-full h-70 hover:scale-95 transition duration-300 hover:shadow-purple-800 hover:shadow-xl object-cover rounded-lg shadow-lg" />
                </div>

                {/* Top Center Image */}
                <div className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2 row-span-2">
                    <img src="/assets/images/home/gallery/2.jpeg" alt="Gallery Image 2" className="w-full h-70 hover:scale-95 transition duration-300 hover:shadow-purple-800 hover:shadow-xl object-cover rounded-lg shadow-lg" />
                </div>

                {/* Top Right Image */}
                <div className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2 row-span-2">
                    <img src="/assets/images/home/gallery/3.jpg" alt="Gallery Image 3" className="w-full h-70 hover:scale-95 transition duration-300 hover:shadow-purple-800 hover:shadow-xl object-cover rounded-lg shadow-lg" />
                </div>

                {/* Far Right Large Image */}
                <div className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-2 row-span-4">
                    <img src="/assets/images/home/gallery/4.jpeg" alt="Gallery Image 4" className="w-full h-70 hover:scale-95 transition duration-300 hover:shadow-purple-800 hover:shadow-xl lg:h-[570px] object-cover rounded-lg shadow-lg" />
                </div>

                {/* Bottom Left Image */}
                <div className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2 row-span-2">
                    <img src="/assets/images/home/gallery/5.jpg" alt="Gallery Image 5" className="w-full h-70 hover:scale-95 transition duration-300 hover:shadow-purple-800 hover:shadow-xl object-cover rounded-lg shadow-lg" />
                </div>

                {/* Bottom Center Image */}
                <div className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2 row-span-2">
                    <img src="/assets/images/home/gallery/6.jpg" alt="Gallery Image 6" className="w-full h-70 hover:scale-95 transition duration-300 hover:shadow-purple-800 hover:shadow-xl object-cover rounded-lg shadow-lg" />
                </div>

                {/* Bottom Wide Image */}
                <div className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-4 row-span-2">
                    <img src="/assets/images/home/gallery/7.jpg" alt="Gallery Image 7" className="w-full h-70 hover:scale-95 transition duration-300 hover:shadow-purple-800 hover:shadow-xl object-cover rounded-lg shadow-lg" />
                </div>

            </div>

            <div className="flex justify-center mx-auto">
                <Link href="/gallery" className="px-6 py-3 hover:cursor-pointer bg-cardinal-pink-800 hover:bg-cardinal-pink-900 text-white rounded-full transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-cardinal-pink-900 focus:ring-opacity-50">
                    View More
                </Link>
            </div>
        </section>
    );
}
