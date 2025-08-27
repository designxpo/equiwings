"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useSidebar } from "@/context/sidebar-context"
import { useAdminAuth } from "@/providers/admin-auth-context"
import { FiHome, FiUsers, FiPackage, FiLogOut, FiX, FiPhone, FiLayers, FiDisc, FiFileText } from "react-icons/fi"

const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: FiHome },
    { name: "Customers", href: "/admin/users", icon: FiUsers },
    { name: "Products", href: "/admin/products", icon: FiPackage },
    { name: "Contacts", href: "/admin/contacts", icon: FiPhone },
    { name: "Announcements", href: "/admin/announcements", icon: FiLayers },
    { name: "News", href: "/admin/news", icon: FiDisc },
    { name: "Blogs", href: "/admin/blogs", icon: FiFileText },
]

export function Sidebar() {
    const { isOpen, isMobile, closeSidebar } = useSidebar()
    const pathname = usePathname()
    const { logout } = useAdminAuth()

    return (
        <>
            {/* Mobile Overlay with slow transition */}
            {isMobile && (
                <div
                    className={`fixed inset-0 bg-black transition-opacity duration-500 ease-in-out z-40 lg:hidden ${isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
                        }`}
                    onClick={closeSidebar}
                />
            )}

            {/* Fixed Sidebar with slow mobile transition */}
            <div
                className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-500 ease-in-out
          lg:z-30 lg:translate-x-0 lg:transition-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
                        <div className="flex items-center gap-2 w-full">
                            <div className="flex h-13 items-center mx-auto justify-center">
                                <Image
                                    src="/assets/images/logo.png"
                                    alt="Logo"
                                    height={100}
                                    width={100}
                                />
                            </div>
                        </div>
                        {/* Close button - Only visible on mobile */}
                        <button
                            onClick={closeSidebar}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors lg:hidden"
                        >
                            <FiX className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => isMobile && closeSidebar()}
                                    className={`flex items-center gap-3 p-3 text-sm font-medium rounded-lg transition-colors ${isActive ? "bg-cardinal-pink-50 text-cardinal-pink-800 border-r-2 border-cardinal-pink-800" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`}>
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User Profile */}
                    <div className="p-3 border-t border-gray-200">
                        <button onClick={logout} className="flex hover:cursor-pointer items-center gap-3 w-full px-3 py-2 mt-2 text-sm font-medium text-red-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
                            <FiLogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
