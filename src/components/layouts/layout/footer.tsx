"use client";
import type React from "react"
import Link from "next/link"
import { LuInstagram, LuFacebook, LuTwitter, LuFileText } from "react-icons/lu"
import { usePathname } from "next/navigation"
import Image from "next/image";

interface FooterLink {
    href: string
    label: string
}

interface SocialLink {
    href: string
    icon: React.ReactNode
    label: string
}

const Footer: React.FC = () => {
    const pathname = usePathname();

    const isBg = pathname === "/about-us" || pathname === "/services";


    const leftColumnLinks: FooterLink[] = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About Us" },
        { href: "/services", label: "Services" },
        { href: "/gallery", label: "Gallery" },
        { href: "/press-coverage", label: "Press Coverage" },
        { href: "/contact-us", label: "Contact Us" },
    ]

    const middleColumnLinks: FooterLink[] = [
        { href: "/other", label: "Other" },
        { href: "/retail", label: "Retail" },
        { href: "/articles", label: "Articles" },
    ]

    const socialLinks: SocialLink[] = [
        { href: "https://instagram.com", icon: <LuInstagram size={28} />, label: "Instagram" },
        { href: "https://facebook.com", icon: <LuFacebook size={28} />, label: "Facebook" },
        { href: "https://twitter.com", icon: <LuTwitter size={28} />, label: "Twitter" },
        { href: "https://medium.com", icon: <LuFileText size={28} />, label: "Medium" },
    ]

    return (
        <footer className={`${isBg ? "bg-cover bg-no-repeat b-center bg-[url('/assets/images/bg-2.webp')] text-white" : "bg-gradient-to-br from-gray-50 to-gray-100 text-[#350D3C]"}  py-20 border-t border-gray-200 relative overflow-hidden`}>

            <div className="max-w-screen-xl mx-auto px-4 md:px-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    {/* Left Column */}
                    <div className="space-y-8">
                        <div className="relative">
                            <h2 className=" font-bold text-2xl mb-6 relative">
                                Navigation
                                <div className={`absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r ${isBg ? "from-white to-[#ffffff00]" : "from-[#350D3C] to-[#ffffff00]"} rounded-full`}></div>
                            </h2>
                            <nav className="flex flex-col space-y-3">
                                {leftColumnLinks.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.href}
                                        className={`group hover:scale-95 ${isBg ? "hover:text-gray-200" : "hover:text-[#53295a]"} font-medium text-xl transition-all duration-300 relative overflow-hidden py-1`}
                                    >
                                        <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-2">
                                            {link.label}
                                        </span>
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Middle Column */}
                    <div className="space-y-8">
                        <div className="relative">
                            <h2 className=" font-bold text-2xl mb-6 relative">
                                Categories
                                <div className={`absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r ${isBg ? "from-white to-[#ffffff00]" : "from-[#350D3C] to-[#ffffff00]"} rounded-full`}></div>
                            </h2>
                            <nav className="flex flex-col space-y-3">
                                {middleColumnLinks.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.href}
                                        className={`group hover:scale-95 ${isBg ? "hover:text-gray-200" : "hover:text-[#53295a]"} font-medium text-xl transition-all duration-300 relative overflow-hidden py-1`}
                                    >
                                        <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-2">
                                            {link.label}
                                        </span>
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-10">
                        {/* Logo */}
                        <div className="flex justify-center md:justify-start">
                            <Link href="/" className="group transition-transform duration-300 hover:scale-105">
                                <Image src={`/assets/images/${isBg ? "white-logo" : "logo"}.png`} alt="Logo" className="w-auto h-24" width={150} height={80} />
                            </Link>
                        </div>

                        {/* Social Media Section */}
                        <div className="text-center md:text-left">
                            <h2 className=" font-bold text-2xl mb-6 relative">
                                Follow Us
                                <div className={`absolute -bottom-2 left-0 md:left-0 w-16 h-1 bg-gradient-to-r ${isBg ? "from-white to-[#ffffff00]" : "from-[#350D3C] to-[#ffffff00]"} rounded-full mx-auto md:mx-0`}></div>
                            </h2>
                            <div className="flex justify-center md:justify-start space-x-4">
                                {socialLinks.map((social, index) => (
                                    <Link
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative"
                                        aria-label={social.label}
                                    >
                                        <div className={`relative p-3 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 ${isBg
                                                ? "bg-white/10 backdrop-blur-sm border border-white/20 text-white group-hover:bg-white group-hover:text-[#350D3C]"
                                                : "bg-white border border-[#350D3C] text-[#350D3C] group-hover:bg-[#350D3C] group-hover:text-white"
                                            }`}>
                                            <div className="transition-colors duration-300 relative z-10">
                                                {social.icon}
                                            </div>
                                        </div>
                                        {/* Tooltip */}
                                        <div className={`absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap ${isBg
                                                ? "bg-white text-[#350D3C]"
                                                : "bg-[#350D3C] text-white"
                                            }`}>
                                            {social.label}
                                            <div className={`absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent ${isBg
                                                    ? "border-t-white"
                                                    : "border-t-[#350D3C]"
                                                }`}></div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Border */}
                <div className={`mt-16 pt-8 border-t ${isBg ? "border-white/20" : "border-[#350D3C]"}`}>
                    <div className="text-center  text-sm">
                        <p>&copy; {new Date().getFullYear()} Equiwings. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer