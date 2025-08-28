"use client"
import Image from "next/image";
import { FaLinkedin, FaTwitter, FaInstagram, FaFacebook } from "react-icons/fa";
import useScrollAnimation from "@/hooks/use-animation";

export default function TeamSection() {
    const visibleElements = useScrollAnimation();

    const teamMembers = [
        {
            name: "Mr Bhishm Gaurav Vashisht",
            position: "CEO & Founder",
            image: "/assets/images/about-us/team1.jpeg",
            bio: "Leading with vision and innovation, Sarah has 15+ years of experience in technology and business development.",
            social: {
                linkedin: "#",
                twitter: "#",
                instagram: "#"
            }
        },
        {
            name: "Dr Hepesh Shepherd",
            position: "Chief Technology Officer",
            image: "/assets/images/about-us/team2.jpeg",
            bio: "Tech visionary with expertise in full-stack development and system architecture. Passionate about cutting-edge solutions.",
            social: {
                linkedin: "#",
                twitter: "#",
                facebook: "#"
            }
        },
        {
            name: "Mr. Vivek Kohli",
            position: "Head of Design",
            image: "/assets/images/about-us/team3.jpeg",
            bio: "Creative designer with a keen eye for user experience and modern aesthetics. Transforms ideas into beautiful interfaces.",
            social: {
                linkedin: "#",
                instagram: "#",
                twitter: "#"
            }
        }
    ];

    return (
        <div className="bg-[url('/assets/images/bg-4.webp')] bg-cover bg-center bg-no-repeat py-8 sm:py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <div
                    className={`text-center mb-8 sm:mb-12 lg:mb-16 transition-all duration-1000 ${visibleElements.has('team-header')
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-10'
                        }`}
                    id="team-header"
                    data-animate
                >
                    <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-4">
                        Advisory Board
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-cardinal-pink-950 to-cardinal-pink-800 rounded-full mx-auto mb-6"></div>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                        Our dedicated team of professionals is committed to delivering exceptional results and driving innovation in everything we do.
                    </p>
                </div>

                {/* Team Members Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className={`group relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 bg-white ${visibleElements.has(`team-member-${index}`)
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-10'
                                }`}
                            id={`team-member-${index}`}
                            data-animate
                            style={{ transitionDelay: `${300 + index * 150}ms` }}
                        >
                            {/* Full Image Container */}
                            <div className="relative h-96 sm:h-[420px] lg:h-[480px] overflow-hidden">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />

                                {/* Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                                {/* Social Media Overlay - Top */}
                                {/* <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="flex flex-col space-y-2">
                                        {member.social.linkedin && (
                                            <a 
                                                href={member.social.linkedin}
                                                className="p-2 sm:p-3 bg-white/90 backdrop-blur-sm rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300 shadow-lg"
                                            >
                                                <FaLinkedin className="text-lg sm:text-xl" />
                                            </a>
                                        )}
                                        {member.social.twitter && (
                                            <a 
                                                href={member.social.twitter}
                                                className="p-2 sm:p-3 bg-white/90 backdrop-blur-sm rounded-full text-blue-400 hover:bg-blue-400 hover:text-white transition-colors duration-300 shadow-lg"
                                            >
                                                <FaTwitter className="text-lg sm:text-xl" />
                                            </a>
                                        )}
                                        {member.social.instagram && (
                                            <a 
                                                href={member.social.instagram}
                                                className="p-2 sm:p-3 bg-white/90 backdrop-blur-sm rounded-full text-pink-600 hover:bg-pink-600 hover:text-white transition-colors duration-300 shadow-lg"
                                            >
                                                <FaInstagram className="text-lg sm:text-xl" />
                                            </a>
                                        )}
                                        {member.social.facebook && (
                                            <a 
                                                href={member.social.facebook}
                                                className="p-2 sm:p-3 bg-white/90 backdrop-blur-sm rounded-full text-blue-700 hover:bg-blue-700 hover:text-white transition-colors duration-300 shadow-lg"
                                            >
                                                <FaFacebook className="text-lg sm:text-xl" />
                                            </a>
                                        )}
                                    </div>
                                </div> */}

                                {/* Text Content Overlay - Bottom */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                                        {member.name}
                                    </h3>
                                    {/* <p className="text-cardinal-pink-300 font-semibold mb-2 sm:mb-4 text-base sm:text-lg">
                                        {member.position}
                                    </p>
                                    <p className="text-white/90 leading-relaxed text-sm sm:text-base line-clamp-3 sm:line-clamp-none">
                                        {member.bio}
                                    </p> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}