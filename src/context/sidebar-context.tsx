"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface SidebarContextType {
    isOpen: boolean
    isMobile: boolean
    toggleSidebar: () => void
    closeSidebar: () => void
    openSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(true)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024
            setIsMobile(mobile)
            // On mobile, start with sidebar closed
            if (mobile) {
                setIsOpen(false)
            } else {
                // On desktop, keep sidebar open
                setIsOpen(true)
            }
        }

        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    const toggleSidebar = () => {
        setIsOpen((prev) => !prev)
    }
    const closeSidebar = () => setIsOpen(false)
    const openSidebar = () => setIsOpen(true)

    return (
        <SidebarContext.Provider
            value={{
                isOpen,
                isMobile,
                toggleSidebar,
                closeSidebar,
                openSidebar,
            }}
        >
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (!context) {
        throw new Error("useSidebar must be used within SidebarProvider")
    }
    return context
}
