// src/lib/seo.ts
import Seo from "@/lib/models/Seo"

export async function getSeoData(type: string) {
    const seo = await Seo.findOne({ type: type.toLowerCase() }).lean()

    if (!seo || Array.isArray(seo)) {
        return {
            title: "Discover India's Premier Equestrian Experience",
            description: "Ride with confidence, learn from experts, and elevate your passion—Equiwings is your one-stop equestrian partner.",
            keywords: "Equiwings, Equestrian, Horse Riding, Horse Training, Riding Lessons, Horse Care, Equestrian Supplies, Riding Gear, Horse Boarding, Equestrian Events",
        }
    }
    return {
        title: seo.metaTitle,
        description: seo.metaDescription,
        keywords: seo.metaKeywords,
    }
}
