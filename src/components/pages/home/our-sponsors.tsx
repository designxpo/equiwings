'use client';
import Image from 'next/image';
import React from 'react';
import Marquee from 'react-fast-marquee';

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
                <h2 className="text-3xl xl:text-5xl font-semibold text-center mb-4 xs:mb-6 sm:mb-8 md:mb-10 text-[#350D3C]">
                    Our Sponsors
                </h2>
                <Marquee
                    autoFill={true}
                    direction="right"
                    className="w-full bg-primary-400 overflow-hidden py-3 xs:py-4 sm:py-6 md:py-8 xl:py-12"
                >
                    {logos.map((logo, index) => (
                        <div
                            key={index}
                            className="inline-flex items-center mx-8 justify-center flex-shrink-0 transition-all duration-300 hover:scale-105"
                        >
                            <Image
                                width={600}
                                height={600}
                                src={logo.src}
                                alt={`${logo.alt} logo`}
                                className="object-contain gap-10 max-w-full filter
                                h-10 w-auto
                                xs:h-12
                                sm:h-16
                                md:h-20
                                lg:h-24"
                                priority={index < 4}
                            />
                        </div>
                    ))}
                </Marquee>
                <Marquee
                    autoFill={true}
                    direction="left"
                    className="w-full bg-primary-400 overflow-hidden py-3 xs:py-4 sm:py-6 md:py-8 xl:py-12"
                >
                    {Array.from({ length: 22 }).map((_, index) => (
                        <div
                            key={index}
                            className="inline-flex items-center mx-8 justify-center flex-shrink-0 transition-all duration-300 hover:scale-105"
                        >
                            <Image
                                width={600}
                                height={600}
                                src={`/assets/images/home/our-sponsors/new/${index + 1}.png`}
                                alt={`Sponsor logo ${index + 1}`}
                                className="object-contain max-w-full filter
                                h-10 w-auto
                                xs:h-12
                                sm:h-16
                                md:h-20
                                lg:h-24"
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




// 'use client';
// import axiosInstance from '@/lib/config/axios';
// import Image from 'next/image';
// import React from 'react';
// import Marquee from 'react-fast-marquee';

// const OurSponsors = () => {
//     const [firstHalf, setFirstHalf] = React.useState<Array<{ src: string; alt: string }>>([]);
//     const [secondHalf, setSecondHalf] = React.useState<Array<{ src: string; alt: string }>>([]);

//     React.useEffect(() => {
//         fetchLogos();
//     }, []);

//     const fetchLogos = async () => {
//         try {
//             const res = await axiosInstance.get(`/customers/sponsor-logos?limit=100`);
//             const logosData = res.data.data.map((item: any) => ({
//                 src: item.logo_url,
//                 alt: item.name,
//             }));

//             const mid = Math.ceil(logosData.length / 2);
//             setFirstHalf(logosData.slice(0, mid));
//             setSecondHalf(logosData.slice(mid));
//         } catch (error) {
//             console.error("Error fetching sponsor logos:", error);
//         }
//     };

//     return (
//         <section id="sponsors" className="bg-white py-4 xs:py-6 sm:py-8 md:pt-10 md:pb:4 lg:pt-14 lg:pb-8 xl:pt-20 xl:pb-12">
//             <div className="max-w-screen-xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
//                 <h2 className="text-3xl xl:text-5xl font-semibold text-center mb-4 xs:mb-6 sm:mb-8 md:mb-10 text-[#350D3C]">
//                     Our Sponsors
//                 </h2>

//                 {/* First Marquee */}
//                 <Marquee
//                     autoFill={true}
//                     direction="right"
//                     className="w-full bg-primary-400 overflow-hidden py-3 xs:py-4 sm:py-6 md:py-8 xl:py-12"
//                 >
//                     {firstHalf.map((logo, index) => (
//                         <div
//                             key={index}
//                             className="inline-flex items-center mx-8 justify-center flex-shrink-0 transition-all duration-300 hover:scale-105"
//                         >
//                             <Image
//                                 width={600}
//                                 height={600}
//                                 src={logo.src}
//                                 alt={`${logo.alt} logo`}
//                                 className="object-contain gap-10 max-w-full filter
//                                 h-10 w-auto
//                                 xs:h-12
//                                 sm:h-16
//                                 md:h-20
//                                 lg:h-24"
//                                 priority={index < 4}
//                             />
//                         </div>
//                     ))}
//                 </Marquee>

//                 {/* Second Marquee */}
//                 <Marquee
//                     autoFill={true}
//                     direction="left"
//                     className="w-full bg-primary-400 overflow-hidden py-3 xs:py-4 sm:py-6 md:py-8 xl:py-12"
//                 >
//                     {secondHalf.map((logo, index) => (
//                         <div
//                             key={index}
//                             className="inline-flex items-center mx-8 justify-center flex-shrink-0 transition-all duration-300 hover:scale-105"
//                         >
//                             <Image
//                                 width={600}
//                                 height={600}
//                                 src={logo.src}
//                                 alt={`${logo.alt} logo`}
//                                 className="object-contain max-w-full filter
//                                 h-10 w-auto
//                                 xs:h-12
//                                 sm:h-16
//                                 md:h-20
//                                 lg:h-24"
//                                 priority={index < 4}
//                             />
//                         </div>
//                     ))}
//                 </Marquee>
//             </div>
//         </section>
//     );
// };

// export default OurSponsors;
