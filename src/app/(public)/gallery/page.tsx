"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const MotionImage = motion(Image);

interface Section {
    images: string[];
    type: '2-col' | '3-col';
}

const Gallery: React.FC = () => {
    const [visibleImages, setVisibleImages] = useState<number>(20);
    const [loading, setLoading] = useState<boolean>(false);

    // Generate array of 52 images
    const generateImages = (): string[] => {
        return Array.from({ length: 49 }, (_, i) => `${i + 1}.jpg`);
    };

    const images: string[] = generateImages();
    const totalImages: number = images.length;
    const imagesToShow: string[] = images.slice(0, visibleImages);

    const showMore = async (): Promise<void> => {
        setLoading(true);
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setVisibleImages(prev => Math.min(prev + 20, totalImages));
        setLoading(false);
    };

    // Function to create sections from images array
    const createSections = (imageArray: string[]): Section[] => {
        const sections: Section[] = [];
        let index = 0;

        while (index < imageArray.length) {
            // Pattern: 2, 3, 2, 3, 2, 3, 2, 3, 2, 3 (repeating)
            const patterns: number[] = [2, 3, 2, 3, 2, 3, 2, 3, 2, 3];
            const patternIndex = Math.floor(index / 20) % patterns.length;

            for (let i = 0; i < patterns.length && index < imageArray.length; i++) {
                const sectionSize = patterns[i];
                const section = imageArray.slice(index, index + sectionSize);
                if (section.length > 0) {
                    sections.push({ images: section, type: sectionSize === 2 ? '2-col' : '3-col' });
                }
                index += sectionSize;
            }
        }
        return sections;
    };

    const sections: Section[] = createSections(imagesToShow);

    const renderSection = (section: Section, sectionIndex: number) => {
        if (section.type === '2-col') {
            // 2-column layout (alternating 4-8 and 8-4 grid)
            const isEven = sectionIndex % 2 === 0;
            return (
                <motion.div 
                    key={sectionIndex} 
                    className="grid md:grid-cols-12 gap-8 lg:mb-11 mb-7"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                >
                    <div className={`${isEven ? 'md:col-span-4' : 'md:col-span-8'} md:h-[404px] h-[277px] w-full rounded-3xl overflow-hidden`}>
                        <MotionImage
                            src={`/assets/images/gallery/${section.images[0]}`}
                            alt="Gallery image"
                            className="object-cover rounded-3xl mx-auto w-full h-full cursor-pointer"
                            height={600}
                            width={600}
                            whileHover={{ scale: 1.05, rotate: isEven ? 1 : -1 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        />
                    </div>
                    {section.images[1] && (
                        <div className={`${isEven ? 'md:col-span-8' : 'md:col-span-4'} md:h-[404px] h-[277px] w-full rounded-3xl overflow-hidden`}>
                            <MotionImage
                                src={`/assets/images/gallery/${section.images[1]}`}
                                alt="Gallery image"
                                className="object-cover rounded-3xl mx-auto w-full h-full cursor-pointer"
                                height={600}
                                width={600}
                                whileHover={{ scale: 1.05, rotate: isEven ? -1 : 1 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                            />
                        </div>
                    )}
                </motion.div>
            );
        } else {
            // 3-column layout
            return (
                <motion.div 
                    key={sectionIndex} 
                    className="grid md:grid-cols-3 grid-cols-1 gap-8 lg:mb-11 mb-7"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                >
                    {section.images.map((img: string, i: number) => (
                        <div key={i} className="h-[277px] w-full rounded-3xl overflow-hidden">
                            <MotionImage
                                src={`/assets/images/gallery/${img}`}
                                alt="Gallery image"
                                className="object-cover rounded-3xl mx-auto w-full h-full cursor-pointer"
                                height={600}
                                width={600}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                            />
                        </div>
                    ))}
                </motion.div>
            );
        }
    };

    return (
        <>
            <section className="py-20 bg-[url(/assets/images/bg-4.webp)] w-full bg-center bg-contain bg-repeat-y">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-2.5 pb-10">
                        <h2 className="w-full text-center text-cardinal-pink-950 text-4xl font-bold font-manrope leading-normal">
                            Our Gallery
                        </h2>
                    </div>

                    <div className="gallery">
                        <div className="flex flex-col mb-10">
                            {sections.map((section, index) => renderSection(section, index))}
                        </div>

                        {/* Show More Button */}
                        {visibleImages < totalImages && (
                            <div className="flex justify-center mt-8">
                                <motion.button
                                    onClick={showMore}
                                    disabled={loading}
                                    className="text-white bg-gradient-to-t from-[#780083] to-[#5B297A] hover:from-[#5B297A] hover:to-[#780083] rounded-md py-2 px-4 font-medium transition-all duration-200 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
                                    whileHover={{ scale: loading ? 1 : 1.05 }}
                                    whileTap={{ scale: loading ? 1 : 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Loading...
                                        </div>
                                    ) : (
                                        `Show More (${Math.min(20, totalImages - visibleImages)} more images)`
                                    )}
                                </motion.button>
                            </div>
                        )}

                        {/* Images Counter */}
                        <div className="text-center mt-4 text-gray-600">
                            Showing {visibleImages} of {totalImages} images
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Gallery;