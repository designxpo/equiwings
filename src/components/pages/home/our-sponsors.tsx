'use client';
import Image from 'next/image';
import React, { useRef, useEffect } from 'react';

interface MarqueeProps {
    direction?: 'left' | 'right';
    speed?: number; // Speed in seconds
    loop?: boolean; // Enable infinite loop
    className?: string;
    children: React.ReactNode;
}

export const Marquee: React.FC<MarqueeProps> = ({
    direction = 'left',
    speed = 10,
    loop = true,
    className = '',
    children,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isDirectionRight = direction === 'right';

    useEffect(() => {
        const container = containerRef.current;
        if (!(container && loop)) return;

        // Small delay to ensure DOM is ready
        let animation: Animation | null = null;
        const timeoutId = window.setTimeout(() => {
            const contentWidth = container.scrollWidth / 2; // Divide by 2 because we duplicate content

            // Build keyframes based on direction
            const keyframes: Keyframe[] = isDirectionRight
                ? [
                    { transform: `translateX(-${contentWidth}px)` }, // move right
                    { transform: `translateX(0)` },
                  ]
                : [
                    { transform: `translateX(0)` }, // move left
                    { transform: `translateX(-${contentWidth}px)` },
                  ];

            animation = container.animate(keyframes, {
                duration: speed * 1000,
                iterations: Infinity,
                easing: 'linear',
            });
        }, 100);

        return () => {
            if (animation) animation.cancel();
            window.clearTimeout(timeoutId);
        };
    }, [speed, isDirectionRight, loop]);

    return (
        <div className={`overflow-hidden whitespace-nowrap relative ${className}`}>
            <div ref={containerRef} className="inline-flex items-center gap-10 md:gap-20">
                {children}
                {/* Duplicate content for seamless loop */}
                {loop && children}
            </div>
        </div>
    );
};

const logos = [
    {
        src: "/assets/images/home/our-sponsors/ntpc.png",
        alt: "NTPC",
    },
    {
        src: "/assets/images/home/our-sponsors/ongc.png",
        alt: "ONGC",
    },
    {
        src: "/assets/images/home/our-sponsors/gail.png",
        alt: "GAIL",
    },
    {
        src: "/assets/images/home/our-sponsors/sail.png",
        alt: "SAIL",
    },
    {
        src: "/assets/images/home/our-sponsors/fifth.png",
        alt: "Fifth",
    },
    // {
    //     src: "/assets/images/home/our-sponsors/logix-group.png",
    //     alt: "Logix Group",
    // },
    {
        src: "/assets/images/home/our-sponsors/stag.png",
        alt: "Stag",
    },
    {
        src: "/assets/images/home/our-sponsors/bdm.png",
        alt: "BDM",
    },
];

const OurSponsors = () => {
    return (
        <section id="sponsors" className="bg-white py-4 xs:py-6 sm:py-8 md:pt-10 md:pb:4 lg:pt-14 lg:pb-8 xl:pt-20 xl:pb-12">
            <div className="max-w-screen-xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
                <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-center mb-4 xs:mb-6 sm:mb-8 md:mb-10 text-[#350D3C]">
                    Our Sponsors
                </h2>
                <Marquee 
                    direction="right" 
                    loop={true} 
                    speed={20} 
                    className="w-full bg-primary-400 overflow-hidden py-3 xs:py-4 sm:py-6 md:py-8 xl:py-12"
                >
                    {logos.map((logo, index) => (
                        <div
                            key={index}
                            className="inline-flex items-center gap-5 justify-center flex-shrink-0 transition-all duration-300 hover:scale-105"
                        >
                            <Image
                                width={600}
                                height={600}
                                src={logo.src}
                                alt={`${logo.alt} logo`}
                                className="object-contain max-w-full filter
                                h-10 w-auto
                                xs:h-12
                                sm:h-16
                                md:h-20
                                lg:h-24
                                xl:h-28
                                2xl:h-32"
                                priority={index < 4}
                            />
                        </div>
                    ))}
                </Marquee>
                <Marquee 
                    direction="left" 
                    loop={true} 
                    speed={20} 
                    className="w-full bg-primary-400 overflow-hidden py-3 xs:py-4 sm:py-6 md:py-8 xl:py-12"
                >
                    {logos.map((logo, index) => (
                        <div
                            key={index}
                            className="inline-flex items-center gap-5 justify-center flex-shrink-0 transition-all duration-300 hover:scale-105"
                        >
                            <Image
                                width={600}
                                height={600}
                                src={logo.src}
                                alt={`${logo.alt} logo`}
                                className="object-contain max-w-full filter
                                h-10 w-auto
                                xs:h-12
                                sm:h-16
                                md:h-20
                                lg:h-24
                                xl:h-28
                                2xl:h-32"
                                priority={index < 4}
                            />
                        </div>
                    ))}
                </Marquee>
            </div>
        </section>
    );
};

export default OurSponsors;