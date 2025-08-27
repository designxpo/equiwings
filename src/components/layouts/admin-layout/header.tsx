"use client"

import React, { useState, useRef, useEffect } from "react"
import { FiBell, FiSettings, FiMenu, FiUser, FiLogOut } from "react-icons/fi"
import { useSidebar } from "@/context/sidebar-context";
import Image from "next/image";
import Link from "next/link";
import { useAdminAuth } from "@/providers/admin-auth-context";

interface HeaderProps {
    title?: string
    breadcrumbs?: Array<{ label: string; href?: string }>
}

export function Header({ title = "Dashboard", breadcrumbs = [] }: HeaderProps) {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
    const { toggleSidebar, isOpen } = useSidebar()
    const modalRef = useRef<HTMLDivElement>(null)
    const { admin, logout } = useAdminAuth();

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsProfileModalOpen(false)
            }
        }

        if (isProfileModalOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isProfileModalOpen])

    const handleProfileClick = () => {
        setIsProfileModalOpen(!isProfileModalOpen)
    }

    return (
        <header className="bg-white border-b border-gray-200 px-4 py-2 sticky top-0 z-20">
            <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    {/* Menu Button - Only visible on mobile */}
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors lg:hidden"
                    >
                        <FiMenu className="h-5 w-5" />
                    </button>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">

                    {/* Notifications */}
                    {/* <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                        <FiBell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-medium">3</span>
                        </span>
                    </button> */}

                    {/* Settings */}
                    {/* <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                        <FiSettings className="h-5 w-5" />
                    </button> */}

                    {/* User Profile */}
                    <div className="relative" ref={modalRef}>
                        <div
                            className="flex items-center gap-3 bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer"
                            onClick={handleProfileClick}
                        >
                            <div className="h-8 w-8 rounded-full flex items-center justify-center">
                                <Image
                                    src="/assets/images/avatar.png"
                                    alt="User Avatar"
                                    height={100}
                                    width={100}
                                    className="rounded-full border-2 border-cardinal-pink-800"
                                />
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-medium text-gray-900">{admin?.firstName + " " + admin?.lastName}</p>
                                <p className="text-xs text-gray-500">{admin?.role.name}</p>
                            </div>
                        </div>

                        {/* Profile Modal */}
                        {isProfileModalOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-30">
                                <Link href="/admin/profile" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    <FiUser className="h-4 w-4" />
                                    Profile
                                </Link>
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                    <FiLogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}