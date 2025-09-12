"use client";
import type React from "react"
import Link from "next/link"
import { LuMail, LuPhone, LuFacebook, LuShoppingBag, LuInstagram } from "react-icons/lu"
import { usePathname } from "next/navigation"
import Image from "next/image";
import toast from "react-hot-toast";

interface FooterLink {
    href: string
    label: string
}

interface ContactItem {
    href: string
    icon: React.ReactNode
    label: string
    type: 'email' | 'phone' | 'social'
}

const Footer: React.FC = () => {
    const pathname = usePathname();

    const isBg = pathname === "/about-us" || pathname === "/services";


    const leftColumnLinks: FooterLink[] = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About Us" },
        { href: "/services", label: "Services" },
        { href: "/gallery", label: "Gallery" },
        { href: "/blogs", label: "Blogs" },
        { href: "/contact-us", label: "Contact Us" },
    ]

    const middleColumnLinks: FooterLink[] = [
        { href: "/other", label: "Other" },
        { href: "/retail", label: "Retail" },
        { href: "/articles", label: "Articles" },
    ]

    const contactItems: ContactItem[] = [
        { href: "mailto:info@equiwings.com", icon: <LuMail size={24} />, label: "info@equiwings.com", type: 'email' },
        { href: "mailto:pranab@equiwings.com", icon: <LuMail size={24} />, label: "pranab@equiwings.com", type: 'email' },
        { href: "tel:+919266103170", icon: <LuPhone size={24} />, label: "+91 92661 03170", type: 'phone' },
        { href: "tel:+919818185513", icon: <LuPhone size={24} />, label: "+91 98181 85513", type: 'phone' },
        { href: "tel:+919266103174", icon: <LuShoppingBag size={24} />, label: "+91 92661 03174", type: 'phone' },
        { href: "https://www.facebook.com/people/Equiwings/100064379361698/", icon: <LuFacebook size={24} />, label: "Facebook", type: 'social' },
    ]

    return (
        <footer className={`${isBg ? "bg-cover bg-no-repeat b-center bg-[url('/assets/images/bg-2.webp')] text-white" : "bg-gradient-to-br from-gray-50 to-gray-100 text-[#350D3C]"}  py-20 border-t border-gray-200 relative overflow-hidden`}>

            <div className="max-w-screen-xl mx-auto px-4 md:px-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
                    {/* Left Column - Navigation */}
                    <div className="md:col-span-4 space-y-8">
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
                                <button onClick={() => toast.success("Coming Soon!")} className={`group text-left hover:cursor-pointer hover:scale-95 ${isBg ? "hover:text-gray-200" : "hover:text-[#53295a]"} font-medium text-xl transition-all duration-300 relative overflow-hidden py-1`}>
                                    GMS
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Middle Column - Categories */}
                    <div className="md:col-span-4 space-y-8">
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
                            <h2 className=" font-bold text-2xl mb-6 mt-4 relative">
                                Contact Us
                                <div className={`absolute -bottom-2 left-0 md:left-0 w-16 h-1 bg-gradient-to-r ${isBg ? "from-white to-[#ffffff00]" : "from-[#350D3C] to-[#ffffff00]"} rounded-full mx-auto md:mx-0`}></div>
                            </h2>

                            {/* Email Section */}
                            <div className="mb-8">
                                <div className="flex gap-5">
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-lg mb-4 opacity-90">Email</h3>
                                        <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start space-y-1 md:space-y-0 md:space-x-2">
                                            <div className="flex items-center md:justify-start space-x-2">
                                                <LuMail size={16} />
                                                <Link href="mailto:info@equiwings.com" className={`hover:underline ${isBg ? "hover:text-gray-200" : "hover:text-[#53295a]"} transition-colors font-medium`}>
                                                    info@equiwings.com
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start space-y-1 md:space-y-0 md:space-x-2">
                                            <div className="flex items-center justify-center md:justify-start space-x-2">
                                                <LuMail size={16} />
                                                <Link href="mailto:pranab@equiwings.com" className={`hover:underline ${isBg ? "hover:text-gray-200" : "hover:text-[#53295a]"} transition-colors font-medium`}>
                                                    pranab@equiwings.com
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Contact Us & Logo (Wider) */}
                    <div className="md:col-span-4 space-y-8">
                        {/* Logo */}
                        <div className="flex justify-center">
                            <Link href="/" className="group transition-transform duration-300 hover:scale-105">
                                <Image src={`/assets/images/${isBg ? "white-logo" : "logo"}.png`} alt="Logo" className="w-auto h-24" width={150} height={80} />
                            </Link>
                        </div>

                        {/* Contact Us Section */}
                        <div className="text-center md:text-left">
                            {/* Social Media */}
                            <div>
                                <h2 className=" font-bold text-2xl mb-6 mt-4 relative">
                                    Follow Us
                                    <div className={`absolute -bottom-2 left-0 md:left-0 w-16 h-1 bg-gradient-to-r ${isBg ? "from-white to-[#ffffff00]" : "from-[#350D3C] to-[#ffffff00]"} rounded-full mx-auto md:mx-0`}></div>
                                </h2>
                                <div className="flex justify-center md:justify-start gap-4">
                                    {/* Facebook */}
                                    <Link
                                        href="https://www.facebook.com/people/Equiwings/100064379361698/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative"
                                        aria-label="Facebook"
                                    >
                                        <div
                                            className={`relative p-3 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 ${isBg
                                                    ? "bg-white/10 backdrop-blur-sm border border-white/20 text-white group-hover:bg-white group-hover:text-[#350D3C]"
                                                    : "bg-white border border-[#350D3C] text-[#350D3C] group-hover:bg-[#350D3C] group-hover:text-white"
                                                }`}
                                        >
                                            <div className="transition-colors duration-300 relative z-10">
                                                <LuFacebook size={28} />
                                            </div>
                                        </div>
                                        {/* Tooltip */}
                                        <div
                                            className={`absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap ${isBg ? "bg-white text-[#350D3C]" : "bg-[#350D3C] text-white"
                                                }`}
                                        >
                                            Facebook
                                            <div
                                                className={`absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent ${isBg ? "border-t-white" : "border-t-[#350D3C]"
                                                    }`}
                                            ></div>
                                        </div>
                                    </Link>

                                    {/* Instagram */}
                                    <Link
                                        href="https://www.instagram.com/equiwings_official?igsh=c2o3dGR2bW1ieHFt"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative"
                                        aria-label="Instagram"
                                    >
                                        <div
                                            className={`relative p-3 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 ${isBg
                                                    ? "bg-white/10 backdrop-blur-sm border border-white/20 text-white group-hover:bg-white group-hover:text-[#350D3C]"
                                                    : "bg-white border border-[#350D3C] text-[#350D3C] group-hover:bg-[#350D3C] group-hover:text-white"
                                                }`}
                                        >
                                            <div className="transition-colors duration-300 relative z-10">
                                                <LuInstagram size={28} />
                                            </div>
                                        </div>
                                        {/* Tooltip */}
                                        <div
                                            className={`absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap ${isBg ? "bg-white text-[#350D3C]" : "bg-[#350D3C] text-white"
                                                }`}
                                        >
                                            Instagram
                                            <div
                                                className={`absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent ${isBg ? "border-t-white" : "border-t-[#350D3C]"
                                                    }`}
                                            ></div>
                                        </div>
                                    </Link>
                                </div>

                                {/* Phone Section */}
                                <div className="my-6">
                                    <h3 className="font-semibold text-lg mb-4 opacity-90">Helpline</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-center md:justify-start space-x-2">
                                            <LuPhone size={16} />
                                            <Link href="tel:+919266103170" className={`hover:underline ${isBg ? "hover:text-gray-200" : "hover:text-[#53295a]"} transition-colors font-medium`}>
                                                +91 92661 03170
                                            </Link>
                                        </div>
                                        <div className="flex items-center justify-center md:justify-start space-x-2">
                                            <LuPhone size={16} />
                                            <Link href="tel:+919818185513" className={`hover:underline ${isBg ? "hover:text-gray-200" : "hover:text-[#53295a]"} transition-colors font-medium`}>
                                                +91 98181 85513
                                            </Link>
                                        </div>
                                        <div className="flex items-center justify-center md:justify-start space-x-2">
                                            <div className="flex items-center justify-center md:justify-start space-x-2">
                                                <LuShoppingBag size={16} />
                                                <Link href="tel:+919266103174" className={`hover:underline ${isBg ? "hover:text-gray-200" : "hover:text-[#53295a]"} transition-colors font-medium`}>
                                                    +91 92661 03174
                                                </Link>
                                            </div>
                                            <span className="text-sm opacity-75">(For Retail Queries)</span>
                                        </div>
                                    </div>
                                </div>
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