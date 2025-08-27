"use client"

import type React from "react"
import { SidebarProvider, useSidebar } from "@/context/sidebar-context"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { Footer } from "./footer"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { isOpen, isMobile } = useSidebar()

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Fixed Sidebar */}
            <Sidebar />

            {/* Main Content with smooth transition for mobile */}
            <div className={`min-h-screen flex flex-col ${isOpen && !isMobile ? "ml-64" : "ml-0"} ${isMobile ? "transition-all duration-500 ease-in-out" : "lg:ml-64"}`}>
                <Header />
                <main className="flex-1 p-4 lg:p-8">{children}</main>
                <Footer />
            </div>
        </div>
    )
}

interface AdminLayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <SidebarProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </SidebarProvider>
    )
}
