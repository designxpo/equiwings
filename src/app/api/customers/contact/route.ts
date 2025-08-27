import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Contact from "@/lib/models/Contact";
import type { IContact } from "@/lib/models/Contact";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            countryCode,
            message,
        } = body;

        // Basic validation
        if (!firstName || !email || !message) {
            return NextResponse.json(
                { error: "firstName, email, and message are required" },
                { status: 400 }
            );
        }

        // Optional phone number validation
        if (
            phoneNumber &&
            !/^[0-9+\-\s()]+$/.test(phoneNumber)
        ) {
            return NextResponse.json(
                { error: "Invalid phone number format" },
                { status: 400 }
            );
        }

        const contact: IContact = await Contact.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            countryCode,
            message,
        });

        return NextResponse.json(
            {
                message: "Contact created successfully",
                contact,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Contact creation error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create contact" },
            { status: 500 }
        );
    }
}
