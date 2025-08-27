"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useCustomerAuth } from "@/providers/customer-auth-context"
import { LuShoppingBag, LuUser } from "react-icons/lu"
import FloatingCartButton from "@/components/common/floating-cart-button"

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, logout, customer } = useCustomerAuth();

  // Check if we're on pages with transparent header
  const isTransparentHeaderPage = pathname === "/" || pathname === "/services" || pathname === "/blogs" || pathname === "/sports-and-events" || pathname.startsWith("/sports-and-events/") || pathname === "/about-us"

  // Navigation links
  const navLinks = [
    { href: "/sports-and-events", label: "Sports & Events" },
    { href: "/services", label: "Services" },
    { href: "/sports-retail", label: "Sports Retail" },
    { href: "/blogs", label: "Blogs" },
    { href: "/about-us", label: "About Us" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (isTransparentHeaderPage) {
        // On transparent header pages, check scroll position
        setIsScrolled(window.scrollY > 50)
      } else {
        // On other pages, always white
        setIsScrolled(true)
      }
    }

    // Set initial state
    if (isTransparentHeaderPage) {
      setIsScrolled(window.scrollY > 50)
    } else {
      setIsScrolled(true)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial state

    return () => window.removeEventListener("scroll", handleScroll)
  }, [isTransparentHeaderPage])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Component for animated underline link
  const AnimatedLink = ({ href, children, className = "", onClick = () => { } }: any) => {
    const isActive = pathname === href

    return (
      <Link
        href={href}
        className={`relative font-medium transition-colors duration-200 group ${className} ${isActive ? "text-purple-400" : ""
          }`}
        onClick={onClick}
      >
        {children}
        {/* Active state underline */}
        {isActive && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-purple-400"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        )}
        {/* Hover state underline - only show if not active */}
        {!isActive && (
          <motion.div className="absolute bottom-0 left-0 h-0.5 bg-purple-400 w-0 group-hover:w-full transition-all duration-300 ease-in-out" />
        )}
      </Link>
    )
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? "bg-white shadow-sm border-b border-gray-200" : "bg-transparent"
          }`}
      >
        <div className="max-w-screen-xl mx-auto px-4 relative">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center w-full mx-auto">
            <div className="flex items-center justify-between w-full">
              {/* Each item gets equal width with flex-1 */}

              {/* LEFT OF LOGO: About Us | Services | Sports & Events */}
              <div className="flex-1 flex justify-center">
                <AnimatedLink
                  href="/about-us"
                  className={`text-sm transition-colors duration-200 hover:text-purple-400 whitespace-nowrap ${pathname === "/about-us"
                    ? "text-purple-400"
                    : isScrolled || isMobileMenuOpen
                      ? "text-gray-700"
                      : "text-white"
                    }`}
                >
                  About Us
                </AnimatedLink>
              </div>

              <div className="flex-1 flex justify-center">
                <AnimatedLink
                  href="/services"
                  className={`text-sm transition-colors duration-200 hover:text-purple-400 whitespace-nowrap ${pathname === "/services"
                    ? "text-purple-400"
                    : isScrolled || isMobileMenuOpen
                      ? "text-gray-700"
                      : "text-white"
                    }`}
                >
                  Services
                </AnimatedLink>
              </div>

              <div className="flex-1 flex justify-center">
                <AnimatedLink
                  href="/sports-and-events"
                  className={`text-sm transition-colors duration-200 hover:text-purple-400 whitespace-nowrap ${pathname === "/sports-and-events"
                    ? "text-purple-400"
                    : isScrolled || isMobileMenuOpen
                      ? "text-gray-700"
                      : "text-white"
                    }`}
                >
                  Sports & Events
                </AnimatedLink>
              </div>

              {/* Logo - Equal width section */}
              <div className="flex-1 flex justify-center">
                <Link href="/" className="flex items-center">
                  <div className="relative w-24 h-24">
                    <Image
                      src={`/assets/images/${isScrolled || isMobileMenuOpen ? "logo" : "white-logo"}.png`}
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </Link>
              </div>

              {/* RIGHT OF LOGO: Sports Retail | Blogs */}
              <div className="flex-1 flex justify-center">
                <AnimatedLink
                  href="/sports-retail"
                  className={`text-sm transition-colors duration-200 hover:text-purple-400 whitespace-nowrap ${pathname === "/sports-retail"
                    ? "text-purple-400"
                    : isScrolled || isMobileMenuOpen
                      ? "text-gray-700"
                      : "text-white"
                    }`}
                >
                  Sports Retail
                </AnimatedLink>
              </div>

              <div className="flex-1 flex justify-center">
                <AnimatedLink
                  href="/blogs"
                  className={`text-sm transition-colors duration-200 hover:text-purple-400 whitespace-nowrap ${pathname === "/blogs"
                    ? "text-purple-400"
                    : isScrolled || isMobileMenuOpen
                      ? "text-gray-700"
                      : "text-white"
                    }`}
                >
                  Blogs
                </AnimatedLink>
              </div>

              {/* Auth/Profile area remains at far right */}
              <div className="flex-1 flex justify-center">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    {/* Profile Button */}
                    <Link
                      href="/profile"
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-cardinal-pink-800 text-white hover:bg-cardinal-pink-700 transition-colors duration-200 shadow-sm"
                    >
                      <span className="text-xl font-bold p-1">
                        {customer ? `${customer.firstName.substring(0, 1).toUpperCase()}${customer.lastName.substring(0, 1).toUpperCase()}` : ""}
                      </span>
                    </Link>
                  </div>
                ) : (
                  <Link
                    href="/signup"
                    className="text-white bg-gradient-to-t from-[#780083] to-[#5B297A] hover:from-[#5B297A] hover:to-[#780083] rounded-md py-2 px-4 font-medium transition-all duration-200 whitespace-nowrap"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          </nav >

          {/* Mobile Navigation */}
          < div className="lg:hidden" >
            <div className="flex items-center justify-between py-4">
              {/* Mobile Logo */}


              <Link href="/" className="flex items-center">
                <div className="relative w-16 h-16">
                  <Image
                    src={`/assets/images/${isScrolled || isMobileMenuOpen ? "logo" : "white-logo"}.png`}
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>

              <div className="flex items-center space-x-4">
                {/* Mobile Cart and Profile buttons for authenticated users */}
                {isAuthenticated && (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-cardinal-pink-800 text-white hover:bg-cardinal-pink-700 transition-colors duration-200 shadow-sm"
                    >
                      <span className="text-lg font-bold p-1">
                        {customer ? `${customer.firstName.substring(0, 1).toUpperCase()}${customer.lastName.substring(0, 1).toUpperCase()}` : ""}
                      </span>
                    </Link>
                  </>
                )}

                {/* Mobile menu button */}
                <button
                  type="button"
                  onClick={toggleMobileMenu}
                  className={`focus:outline-none p-2 transition-colors duration-200 ${isScrolled || isMobileMenuOpen
                    ? "text-gray-900 hover:text-gray-700"
                    : "text-white hover:text-gray-200"
                    }`}
                  aria-label="Toggle menu"
                >
                  <div className="flex flex-col space-y-1">
                    <div
                      className={`w-6 h-0.5 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? "bg-gray-900" : "bg-white"
                        } ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
                    ></div>
                    <div
                      className={`w-6 h-0.5 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? "bg-gray-900" : "bg-white"
                        } ${isMobileMenuOpen ? "opacity-0" : ""}`}
                    ></div>
                    <div
                      className={`w-6 h-0.5 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? "bg-gray-900" : "bg-white"
                        } ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
                    ></div>
                  </div>
                </button>
              </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
              className={`absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50 w-full transition-all duration-500 ease-in-out transform ${isMobileMenuOpen
                ? "opacity-100 translate-y-0 max-h-max"
                : "opacity-0 -translate-y-4 max-h-0 overflow-hidden pointer-events-none"
                }`}
            >
              <nav className="px-4 py-6 space-y-4">
                {navLinks.map((link) => (
                  <AnimatedLink
                    key={link.href}
                    href={link.href}
                    className="block text-gray-700 hover:text-purple-800 font-medium py-2 transition-all duration-200 transform hover:translate-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </AnimatedLink>
                ))}
                {!isAuthenticated && (
                  <Link
                    href="/signup"
                    className="block text-white text-center bg-gradient-to-t from-[#780083] to-[#5B297A] hover:from-[#5B297A] hover:to-[#780083] rounded-md py-2 px-4 font-medium mt-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                )}
              </nav>
            </div>
          </div >
        </div >
      </header >

      {/* Spacer for non-transparent header pages */}
      {!isTransparentHeaderPage && <div className="h-20 lg:h-20"></div>}
      {isAuthenticated && <FloatingCartButton />}

    </>
  )
}

export default Header