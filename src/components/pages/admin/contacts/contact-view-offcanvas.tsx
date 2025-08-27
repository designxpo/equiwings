"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { FiX, FiMail, FiPhone, FiUser, FiCalendar, FiMessageSquare } from "react-icons/fi"
import axiosInstance from "@/lib/config/axios"
import toast from "react-hot-toast"

type Contact = {
    _id: string
    firstName: string
    lastName?: string
    email: string
    countryCode?: string
    phoneNumber?: string
    message: string
    createdAt: string
    updatedAt: string
}

interface ContactViewOffcanvasProps {
    isOpen: boolean
    onClose: () => void
    contact: Contact
}

const ContactViewOffcanvas: React.FC<ContactViewOffcanvasProps> = ({ isOpen, onClose, contact }) => {

    // Close when the user presses ESC
    useEffect(() => {
        if (!isOpen) return
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose()
            }
        }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [isOpen, onClose])

    // Prevent scrolling behind the modal
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
            return () => {
                document.body.style.overflow = ""
            }
        }
    }, [isOpen])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed right-0 top-0 h-full w-full max-w-3xl bg-white shadow-xl">
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cardinal-pink-100">
                                <FiMail className="h-4 w-4 text-cardinal-pink-800" />
                            </span>
                            <h2 className="text-lg font-semibold text-gray-900">Contact Details</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                        >
                            <FiX className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="space-y-6 p-6">
                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Contact Information</h3>

                                {/* Name */}
                                <div className="flex items-start gap-3">
                                    <FiUser className="mt-1 h-4 w-4 text-gray-400" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Full Name</div>
                                        <div className="text-sm text-gray-600">
                                            {contact.firstName} {contact.lastName || ""}
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-3">
                                    <FiMail className="mt-1 h-4 w-4 text-gray-400" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Email</div>
                                        <div className="text-sm text-gray-600">
                                            <a
                                                href={`mailto:${contact.email}`}
                                                className="text-cardinal-pink-800 hover:text-cardinal-pink-900 transition-colors"
                                            >
                                                {contact.email}
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Phone */}
                                {contact.countryCode && contact.phoneNumber && (
                                    <div className="flex items-start gap-3">
                                        <FiPhone className="mt-1 h-4 w-4 text-gray-400" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">Phone</div>
                                            <div className="text-sm text-gray-600">
                                                <a
                                                    href={`tel:${contact.countryCode}${contact.phoneNumber}`}
                                                    className="text-cardinal-pink-800 hover:text-cardinal-pink-900 transition-colors"
                                                >
                                                    {contact.countryCode} {contact.phoneNumber}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Date */}
                                <div className="flex items-start gap-3">
                                    <FiCalendar className="mt-1 h-4 w-4 text-gray-400" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">Submitted</div>
                                        <div className="text-sm text-gray-600">{formatDate(contact.createdAt)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Message</h3>

                                <div className="flex items-start gap-3">
                                    <FiMessageSquare className="mt-1 h-4 w-4 text-gray-400 flex-shrink-0" />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900 mb-2">Content</div>
                                        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {contact.message}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Quick Actions</h3>

                                <div className="flex flex-col gap-2">
                                    <a
                                        href={`mailto:${contact.email}?subject=Re: Your Contact Form Submission`}
                                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-cardinal-pink-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cardinal-pink-900"
                                    >
                                        <FiMail className="h-4 w-4" />
                                        Reply via Email
                                    </a>

                                    {contact.countryCode && contact.phoneNumber && (
                                        <a
                                            href={`tel:${contact.countryCode}${contact.phoneNumber}`}
                                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                        >
                                            <FiPhone className="h-4 w-4" />
                                            Call Contact
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactViewOffcanvas
