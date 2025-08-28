"use client"
import Image from "next/image";
import useScrollAnimation from "@/hooks/use-animation";

export default function DirectorSection() {
    const visibleElements = useScrollAnimation();

    return (
        <div className="flex justify-center z-20 items-center px-4 bg-[url('/assets/images/bg-4.webp')] bg-cover">
            <div className="-mt-20 mb-20 z-20 bg-white max-w-7xl w-full shadow-2xl rounded-2xl overflow-hidden">

                <div className="px-4 py-8 md:p-12 lg:p-18">
                    <p
                        id="intro-para-1"
                        data-animate
                        className={`text-center mb-5 transition-all duration-1000 transform ${visibleElements.has('intro-para-1')
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-8 opacity-0'
                            }`}
                    >
                        Equiwings Sports is a prominent force in India's equestrian ecosystem, acclaimed for delivering marquee international, Asian, and world-level championships. Beyond event management, the organisation drives athlete and coach development through structured training programs, expert sports consultancy, and industry-recognised certifications. Its social-sport initiatives broaden access and nurture grassroots talent nationwide.
                    </p>
                    <p
                        id="intro-para-2"
                        data-animate
                        className={`text-center mb-5 transition-all duration-1000 delay-200 transform ${visibleElements.has('intro-para-2')
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-8 opacity-0'
                            }`}
                    >
                        Trusted by leading enterprises and global brands, Equiwings designs high-impact safety-first programs that elevate performance and strengthen sporting culture. With a mission to shape a sustainable future for equestrian sport in India, the team blends deep domain expertise with purpose-led guidance for riders, teams, and institutions.
                    </p>
                    <h3
                        id="key-drivers-title"
                        data-animate
                        className={`text-2xl font-semibold text-center text-cardinal-pink-950 my-10 transition-all duration-1000 delay-400 transform ${visibleElements.has('key-drivers-title')
                            ? 'translate-y-0 opacity-100'
                            : 'translate-y-8 opacity-0'
                            }`}
                    >
                        Key Drivers of Equiwings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                        <div
                            id="driver-1"
                            data-animate
                            className={`shadow-lg p-4 md:p-8 rounded-2xl border border-cardinal-pink-800 transition-all duration-1000 delay-600 transform ${visibleElements.has('driver-1')
                                ? 'translate-y-0 opacity-100'
                                : 'translate-y-8 opacity-0'
                                }`}
                        >
                            <h4 className="text-lg font-semibold mb-3 text-cardinal-pink-950">
                                Focused approach towards Equestrian Sports
                            </h4>
                            <p>
                                Equiwings is widely recognised across India for advancing equestrian sports through the planning and delivery of high-caliber events. With a dedicated focus on the sport's growth, the company curates prestigious competitions and showcases that raise standards, expand visibility, and strengthen the national equestrian ecosystem.
                            </p>
                        </div>

                        <div
                            id="driver-2"
                            data-animate
                            className={`shadow-lg p-4 md:p-8 rounded-2xl border border-cardinal-pink-800 transition-all duration-1000 delay-700 transform ${visibleElements.has('driver-2')
                                ? 'translate-y-0 opacity-100'
                                : 'translate-y-8 opacity-0'
                                }`}
                        >
                            <h4 className="text-lg font-semibold mb-3 text-cardinal-pink-950">
                                Expertise along with the Trust
                            </h4>
                            <p>
                                Founded by former national, international, and Olympic athletes, Equiwings blends insider knowledge with world-class operational rigor. This athlete-led approach ensures precise technical oversight, robust safety and fairness protocols, and seamless event management, thus delivering a consistently premium experience for riders, teams, and spectators alike.
                            </p>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <p
                            id="services-title"
                            data-animate
                            className={`text-lg mb-3 font-semibold text-center text-cardinal-pink-950 transition-all duration-1000 delay-800 transform ${visibleElements.has('services-title')
                                ? 'translate-y-0 opacity-100'
                                : 'translate-y-8 opacity-0'
                                }`}
                        >
                            Equiwings delivers comprehensive, turnkey services for the global sports and equestrian ecosystem:
                        </p>

                        <div
                            id="services-list"
                            data-animate
                            className={`grid grid-cols-1 md:grid-cols-2 my-4 px-4 gap-6 transition-all duration-1000 delay-1000 transform ${visibleElements.has('services-list')
                                ? 'translate-y-0 opacity-100'
                                : 'translate-y-8 opacity-0'
                                }`}
                        >
                            <ul className="list-disc pl-5 space-y-2">
                                <li> Organising international and world equestrian championships.</li>
                                <li> Horse Supply & Hire Services.</li>
                            </ul>
                            <ul className="list-disc pl-5 space-y-8">
                                <li> Sports Training & Infrastructure Development</li>
                                <li> Outsourced Sports Contracting</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Left Content Section */}
                    <div className="order-2 lg:order-1 flex flex-col text-center justify-center p-8 lg:p-12">
                        {/* Mobile Director Image - Centered and Circular */}
                        <div
                            id="mobile-director-image"
                            data-animate
                            className={`block lg:hidden mb-6 transition-all duration-1000 delay-1200 transform ${visibleElements.has('mobile-director-image')
                                ? 'translate-y-0 opacity-100'
                                : 'translate-y-8 opacity-0'
                                }`}
                        >
                            <div className="flex justify-center">
                                <div className="relative w-24 h-24 sm:w-40 sm:h-40 border-2 border-cardinal-pink-900 rounded-full">
                                    <Image
                                        src="/assets/images/about-us/director.jpeg"
                                        alt="Director Image"
                                        fill
                                        className="rounded-full object-cover p-1"
                                        sizes="(max-width: 640px) 96px, 128px"
                                    />
                                </div>
                            </div>
                        </div>
                        <h2
                            id="director-name"
                            data-animate
                            className={`text-2xl lg:text-3xl font-bold text-cardinal-pink-950 transition-all duration-1000 delay-1200 transform ${visibleElements.has('director-name')
                                ? 'translate-y-0 opacity-100'
                                : 'translate-y-8 opacity-0'
                                }`}
                        >
                            Ahmad Afsar
                        </h2>

                        <h3
                            id="director-title"
                            data-animate
                            className={`text-lg font-semibold text-gray-900 mb-4 transition-all duration-1000 delay-1300 transform ${visibleElements.has('director-title')
                                ? 'translate-y-0 opacity-100'
                                : 'translate-y-8 opacity-0'
                                }`}
                        >
                            Chairman & Managing Director
                        </h3>

                        <div
                            id="director-content"
                            data-animate
                            className={`space-y-4 text-gray-600 text-xs lg:text-base leading-relaxed transition-all duration-1000 delay-1400 transform ${visibleElements.has('director-content')
                                ? 'translate-y-0 opacity-100'
                                : 'translate-y-8 opacity-0'
                                }`}
                        >
                            <p></p>

                            <p className="italic">
                                "Success, for us, is measured not just in trophies or attendance figures, but in the memories we create, the opportunities we provide, and the communities we help build. And this is just the beginning — the next chapter for Equiwings Sports will be even more ambitious."
                            </p>

                            <div className="text-xs text-gray-500 mt-6 space-y-1">
                                <p className="font-semibold">Former Coach & Manager - Indian Equestrian Tent Pegging Team</p>
                                <p className="font-semibold">Co-Chair - Asian Equestrian Federation (AEF) Tent Pegging Committee</p>
                                <p>Life Member - Equestrian Federation of India</p>
                                <p>ITPF Certified Coach & Judge</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Image Section */}
                    <div className="order-1 lg:order-2 hidden lg:block">
                        <div
                            id="desktop-director-image"
                            data-animate
                            className={`w-1/2 flex justify-center mx-auto transition-all duration-1000 delay-1500 transform ${visibleElements.has('desktop-director-image')
                                ? 'translate-y-0 opacity-100'
                                : 'translate-y-8 opacity-0'
                                }`}
                        >
                            <Image
                                src="/assets/images/about-us/director.jpeg"
                                alt="Director Image"
                                height={300}
                                width={300}
                                className=""
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}