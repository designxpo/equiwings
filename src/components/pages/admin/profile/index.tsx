"use client"

import type React from "react"

import axiosInstance from "@/lib/config/axios"
import { useAdminAuth } from "@/providers/admin-auth-context"
import { useState } from "react"
import { LuUser, LuMail, LuPhone, LuCalendar, LuPencil, LuSave, LuX, LuShield, LuCamera } from "react-icons/lu"
import Image from "next/image"
import Loader2 from "@/utils/loaders"

interface AdminProfile {
    _id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    countryCode: string
    role: {
        _id: string
        name: string
    }
    isEmailVerified: boolean
    createdAt: string
    updatedAt: string
}

export default function AdminProfile() {
    const { admin, fetchAdmin } = useAdminAuth()
    const [saving, setSaving] = useState(false)
    const [editing, setEditing] = useState(false)
    const [editedProfile, setEditedProfile] = useState<AdminProfile | null>(null)

    const handleEdit = () => {
        setEditing(true)
        setEditedProfile(admin)
    }

    const handleCancel = () => {
        setEditing(false)
        setEditedProfile(admin)
    }

    const handleSave = async () => {
        if (!editedProfile) return
        setSaving(true)
        try {
            const res = await axiosInstance.put("/admin/profile", editedProfile);
            fetchAdmin()
            setEditing(false)
            setSaving(false)
            // You might want to update the admin context here
        } catch (error) {
            console.error("Failed to update profile:", error)
            setSaving(false)
        }
    }

    const handleInputChange = (field: string, value: any) => {
        if (!editedProfile) return
        setEditedProfile({
            ...editedProfile,
            [field]: value,
        })
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
        }
    }

    if (!admin) return <Loader2 />

    const currentProfile = editing ? editedProfile! : admin

    return (
        <div className="space-y-6 mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
                    <p className="text-gray-500">Manage your profile information</p>
                </div>
                {!editing ? (
                    <button
                        onClick={handleEdit}
                        className="flex items-center px-4 py-2 bg-cardinal-pink-800 text-white rounded-md hover:bg-cardinal-pink-900 transition-colors"
                    >
                        <LuPencil className="mr-2 h-4 w-4" />
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex space-x-3">
                        <button
                            onClick={handleCancel}
                            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <LuX className="mr-2 h-4 w-4" />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center px-4 py-2 bg-cardinal-pink-800 text-white rounded-md hover:bg-cardinal-pink-900 transition-colors disabled:opacity-50"
                        >
                            <LuSave className="mr-2 h-4 w-4" />
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6">
                            <div className="text-center">
                                <div className="relative inline-block">
                                    <Image
                                        src="/assets/images/avatar.png"
                                        alt="User Avatar"
                                        height={100}
                                        width={100}
                                        className="rounded-full border-2 border-cardinal-pink-800"
                                    />
                                    <div className="absolute bottom-0 right-0">
                                        <label className="bg-cardinal-pink-800 text-white rounded-full p-2 h-8 w-8 flex items-center justify-center hover:bg-cardinal-pink-800 transition-colors cursor-pointer">
                                            <LuCamera className="h-3 w-3" />
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {currentProfile.firstName} {currentProfile.lastName}
                                    </h3>
                                    <div className="flex items-center justify-center mt-2">
                                        <LuShield className="h-4 w-4 text-cardinal-pink-800 mr-1" />
                                        <span className="text-sm font-medium text-cardinal-pink-800">{currentProfile.role?.name}</span>
                                    </div>
                                    <div className="mt-2">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentProfile.isEmailVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {currentProfile.isEmailVerified ? "Email Verified" : "Email Not Verified"}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center justify-center text-sm text-gray-500">
                                        <LuCalendar className="mr-2 h-4 w-4" />
                                        Joined {new Date(currentProfile.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center justify-center text-sm text-gray-500">
                                        <LuUser className="mr-2 h-4 w-4" />
                                        Last updated {new Date(currentProfile.updatedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <LuUser className="mr-2 h-5 w-5" />
                                Personal Information
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            value={currentProfile.firstName}
                                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 outline-none focus:ring-cardinal-pink-800 focus:border-cardinal-pink-800"
                                        />
                                    ) : (
                                        <p className="text-sm mt-1 text-gray-900">{currentProfile.firstName}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    {editing ? (
                                        <input
                                            type="text"
                                            value={currentProfile.lastName}
                                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 outline-none focus:ring-cardinal-pink-800 focus:border-cardinal-pink-900"
                                        />
                                    ) : (
                                        <p className="text-sm mt-1 text-gray-900">{currentProfile.lastName}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    {editing ? (
                                        <input
                                            type="email"
                                            value={currentProfile.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 outline-none focus:ring-cardinal-pink-800 focus:border-cardinal-pink-800"
                                        />
                                    ) : (
                                        <p className="text-sm mt-1 flex items-center text-gray-900">
                                            <LuMail className="mr-2 h-4 w-4 text-gray-500" />
                                            {currentProfile.email}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    {editing ? (
                                        <div className="flex">
                                            <select
                                                value={currentProfile.countryCode}
                                                onChange={(e) => handleInputChange("countryCode", e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-l-md focus:ring-2 outline-none focus:ring-cardinal-pink-800 focus:border-cardinal-pink-800"
                                            >
                                                <option value="+1">+1</option>
                                                <option value="+44">+44</option>
                                                <option value="+91">+91</option>
                                                <option value="+86">+86</option>
                                                <option value="+33">+33</option>
                                                <option value="+49">+49</option>
                                            </select>
                                            <input
                                                type="text"
                                                value={currentProfile.phoneNumber}
                                                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                                className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:ring-2 outline-none focus:ring-cardinal-pink-800 focus:border-cardinal-pink-800"
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-sm mt-1 flex items-center text-gray-900">
                                            <LuPhone className="mr-2 h-4 w-4 text-gray-500" />
                                            {currentProfile.countryCode} {currentProfile.phoneNumber}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* <div className="pt-4 border-t border-gray-200">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Account Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                                        <p className="text-sm text-gray-500 font-mono">{currentProfile._id}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role ID</label>
                                        <p className="text-sm text-gray-500 font-mono">{currentProfile.role?._id}</p>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
