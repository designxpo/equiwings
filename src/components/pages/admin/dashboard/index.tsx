"use client"

import { FiUsers, FiPackage, FiDollarSign, FiTrendingUp } from "react-icons/fi"
import Link from "next/link"
import Image from "next/image"
import type { IconType } from "react-icons"
import { LuMoveRight } from "react-icons/lu"
import { useAdminAuth } from "@/providers/admin-auth-context"

interface StatCardProps {
    title: string
    value: string
    change: string
    changeType: "increase" | "decrease"
    icon: IconType
}

const stats = [
    {
        title: "Total Customers",
        value: "1,234",
        change: "+12%",
        changeType: "increase" as const,
        icon: FiUsers,
    },
    {
        title: "Total Products",
        value: "456",
        change: "+8%",
        changeType: "increase" as const,
        icon: FiPackage,
    },
    {
        title: "Revenue",
        value: "$12,345",
        change: "+15%",
        changeType: "increase" as const,
        icon: FiDollarSign,
    },
    {
        title: "Growth Rate",
        value: "23%",
        change: "+3%",
        changeType: "increase" as const,
        icon: FiTrendingUp,
    },
]

const recentUsers = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", joinedAt: "2 hours ago" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", joinedAt: "4 hours ago" },
    { id: 3, name: "Carol Davis", email: "carol@example.com", joinedAt: "6 hours ago" },
]

const recentProducts = [
    { id: 1, name: "Wireless Headphones", category: "Electronics", addedAt: "1 day ago" },
    { id: 2, name: "Smart Watch", category: "Wearables", addedAt: "2 days ago" },
    { id: 3, name: "Laptop Stand", category: "Accessories", addedAt: "3 days ago" },
]


function StatCard({ title, value, change, changeType, icon: Icon }: StatCardProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className="p-3 bg-cardinal-pink-50 rounded-lg">
                    <Icon className="h-6 w-6 text-cardinal-pink-800" />
                </div>
            </div>
            <div className="mt-4 flex items-center">
                <span
                    className={`font-medium px-2 py-1 rounded-full text-xs ${changeType === "increase" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                >
                    {change}
                </span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
        </div>
    )
}

export default function AdminDashboard() {
    const { admin } = useAdminAuth();

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {admin?.firstName + " " + admin?.lastName}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

            {/* Profile Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Profile Summary</h3>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Image src="/assets/images/avatar.png" alt="Profile" width={100} height={100} className="rounded-full border-2 border-cardinal-pink-800" />
                    <div className="flex-1 space-y-1">
                        <h4 className="text-lg font-semibold text-gray-900">{admin?.firstName + " " + admin?.lastName}</h4>
                        <p className="text-gray-600 text-sm">{admin?.role.name}</p>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-500">
                            <span>📧 {admin?.email}</span>
                            <span>📱 {admin?.countryCode + " " + admin?.phoneNumber}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <Link
                            href="/admin/profile"
                            className="group flex items-center gap-1 text-sm font-medium text-cardinal-pink-800 hover:underline"
                        >
                            View Profile
                            <LuMoveRight className="transition-transform duration-300 transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-4 lg:grid-cols-2">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FiUsers className="h-5 w-5 text-cardinal-pink-800" />
                        <h3 className="text-lg font-semibold text-gray-900">Recent Customers</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Latest user registrations</p>
                    <div className="space-y-4">
                        {recentUsers.map((user) => (
                            <div key={user.id} className="flex items-center gap-3">
                                <div className="h-9 w-9 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-700">
                                        {user.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </span>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                                <div className="text-xs text-gray-500">{user.joinedAt}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FiPackage className="h-5 w-5 text-cardinal-pink-800" />
                        <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Latest product additions</p>
                    <div className="space-y-4">
                        {recentProducts.map((product) => (
                            <div key={product.id} className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200">
                                    <FiPackage className="h-4 w-4 text-gray-600" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                    <p className="text-xs text-gray-500">{product.category}</p>
                                </div>
                                <div className="text-xs text-gray-500">{product.addedAt}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
