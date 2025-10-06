import Seo from "@/lib/models/Seo"
import connectDB from "@/lib/db/connection"

export async function getSeoData(type: string) {
    try {
        await connectDB();

        const seo = await Seo.findOne({ type: type.toLowerCase() }).lean()

        if (!seo || Array.isArray(seo)) {
            return {
                title: "Discover India's Premier Equestrian Experience",
                description:
                    "Ride with confidence, learn from experts, and elevate your passion—Equiwings is your one-stop equestrian partner.",
                keywords:
                    "Equiwings, Equestrian, Horse Riding, Horse Training, Riding Lessons, Horse Care, Equestrian Supplies, Riding Gear, Horse Boarding, Equestrian Events",
            }
        } 

        return {
            title: seo.metaTitle || "Discover India's Premier Equestrian Experience",
            description:
                seo.metaDescription ||
                "Ride with confidence, learn from experts, and elevate your passion—Equiwings is your one-stop equestrian partner.",
            keywords:
                seo.metaKeywords ||
                "Equiwings, Equestrian, Horse Riding, Horse Training, Riding Lessons, Horse Care, Equestrian Supplies, Riding Gear, Horse Boarding, Equestrian Events",
        }
    } catch (err) {
        console.error("Error fetching SEO data:", err)
        return {
            title: "Discover India's Premier Equestrian Experience",
            description:
                "Ride with confidence, learn from experts, and elevate your passion—Equiwings is your one-stop equestrian partner.",
            keywords:
                "Equiwings, Equestrian, Horse Riding, Horse Training, Riding Lessons, Horse Care, Equestrian Supplies, Riding Gear, Horse Boarding, Equestrian Events",
        }
    }
}
