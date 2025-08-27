import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Contact from "@/lib/models/Contact";
import { authenticate, authorize } from "@/lib/middleware/auth";

// GET a single contact by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string; }> }) {
    try {
        const { id } = await params
        const user = await authenticate(request);
        await authorize(user, "CONTACT", "READ");
        await connectDB();

        const contact = await Contact.findById(id);
        if (!contact) {
            return NextResponse.json({ message: "Contact not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Contact fetched successfully", contact }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching contact" }, { status: 500 });
    }
}

// PUT or PATCH to update a contact
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await authenticate(request);
        await authorize(user, "CONTACT", "UPDATE");
        await connectDB();

        const { id } = await params;
        const body = await request.json();
        const updatedContact = await Contact.findByIdAndUpdate(id, body, { new: true });

        if (!updatedContact) {
            return NextResponse.json({ message: "Contact not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Contact updated successfully", contact: updatedContact }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error updating contact" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await authenticate(request);
        // await authorize(user, "CONTACT", "DELETE");
        await connectDB();

        const { id } = await params;
        const deletedContact = await Contact.findByIdAndDelete(id);

        if (!deletedContact) {
            return NextResponse.json({ message: "Contact not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Contact deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting contact" }, { status: 500 });
    }
}

