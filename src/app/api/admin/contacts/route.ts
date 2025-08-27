import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Contact, { IContact } from "@/lib/models/Contact";
import { authenticate, authorize } from "@/lib/middleware/auth";


export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const user = await authenticate(request);
        // await authorize(user, "CONTACT", "READ");

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search");

        const skip = (page - 1) * limit;

        const query: any = {};

        if (search) {
            query.$or = [
                {
                    $or: [
                        { firstName: { $regex: search, $options: "i" } },
                        { lastName: { $regex: search, $options: "i" } },
                    ],
                },
                { email: { $regex: search, $options: "i" } },
                { phoneNumber: { $regex: search, $options: "i" } },
            ];
        }

        const contacts = await Contact.find<IContact>(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Contact.countDocuments(query);

        return NextResponse.json(
            {
                contacts,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
                message: "Contacts fetched successfully",
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching contacts:", error);
        return NextResponse.json(
            { message: "Error fetching contacts", error: error.message },
            { status: 500 }
        );
    }
}