import Image from "next/image";
import Link from "next/link";
import {  FaGlobeAsia, FaHandsHelping, FaUserFriends, FaUserShield } from "react-icons/fa";
import { MdEmojiEvents } from "react-icons/md";

export default function WhyChooseUsSection() {
    const features = [
    {
        icon: <FaUserShield className="text-cardinal-pink-900 text-2xl" />,
        title: "Expert Coaches & Care",
        description: "Certified professionals ensure safety and growth."
    },
    {
        icon: <FaUserFriends className="text-cardinal-pink-900 text-2xl" />,
        title: "All Levels Welcome",
        description: "From 'first-ride' to professional competition prep."
    },
    {
        icon: <FaGlobeAsia className="text-cardinal-pink-900 text-2xl" />,
        title: "National & International Reach",
        description: "Access training venues across India & abroad."
    },
    {
        icon: <FaHandsHelping className="text-cardinal-pink-900 text-2xl" />,
        title: "End-to-End Solutions",
        description: "From coaching to competition, we manage it all."
    },
    {
        icon: <MdEmojiEvents className="text-cardinal-pink-900 text-2xl" />,
        title: "Proven Results",
        description: "Show wins, certified riders & lifelong equestrian journeys."
    }
];

    return (
        <div className="bg-gray-50">
            <div className="max-w-screen mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
                    {/* Left Image Section - Full coverage */}
                    <div className="relative">
                        <Image
                            src="/assets/images/about-us/wcu.jpg"
                            alt="Why Choose Us"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    </div>

                    {/* Right Content Section */}
                    <div className="flex flex-col justify-center p-8 lg:p-16 bg-white">
                        <div className="mb-12">
                            <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-4">
                                Why Choose Equiwings?
                            </h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-cardinal-pink-950 to-cardinal-pink-800 rounded-full"></div>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {features.map((feature, index) => (
                                <div 
                                    key={index}
                                    className="group hover:bg-gray-50 p-6 rounded-xl transition-all duration-300 hover:shadow-lg border border-transparent hover:border-gray-200"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 p-3 bg-gray-100 rounded-lg group-hover:bg-white transition-colors duration-300">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {feature.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Call to Action */}
                        <div className="mt-12 text-center">
                            <Link href="/register" className="bg-gradient-to-r from-cardinal-pink-950 to-cardinal-pink-800 text-white px-8 py-3 rounded-lg font-semibold hover:to-cardinal-pink-950 hover:from-cardinal-pink-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}