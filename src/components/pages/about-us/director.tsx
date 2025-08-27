import Image from "next/image";

export default function DirectorSection() {
    return (
        <div className="flex justify-center items-center px-4 bg-[url('/assets/images/bg-4.webp')] bg-cover">
            <div className="-mt-20 mb-20 bg-white max-w-7xl w-full shadow-2xl rounded-2xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                    {/* Left Content Section */}
                    <div className="order-2 lg:order-1 flex flex-col text-center justify-center p-8 lg:p-12">
                        {/* Mobile Director Image - Centered and Circular */}
                        <div className="block lg:hidden mb-6">
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

                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                            Ahmad Afsar
                        </h2>

                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Chairman & Managing Director
                        </h3>

                        <div className="space-y-4 text-gray-600 text-xs lg:text-base leading-relaxed">
                            <p className="italic">
                                "When I started Equiwings Sports, my vision was simple — to take sports that carry deep tradition, like equestrian and polo, and present them in a way that excites modern audiences. We wanted to create a professional ecosystem where athletes, fans, and partners could come together, not just for competition, but for a shared experience of excellence and passion."
                            </p>

                            <p>
                                From our first event to where we stand today and for the several Sports Academies we run, Equiwings Sports has grown into a brand that people trust and look forward to. We've brought innovation to heritage sports, introduced structured leagues, and built platforms for young talent to shine. Every achievement has been a team effort — from the riders and players to the staff, partners, and the loyal fans who have supported us.
                            </p>

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

                        {/* Signature Image */}
                        <div className="flex justify-center lg:justify-end mt-6">
                            <Image
                                src="/assets/images/about-us/sign.png"
                                alt="Director Signature"
                                width={120}
                                height={60}
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Right Image Section */}
                    <div className="order-1 lg:order-2 relative bg-gray-50">
                        <Image
                            src="/assets/images/about-us/director.jpeg"
                            alt="Director Image"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}