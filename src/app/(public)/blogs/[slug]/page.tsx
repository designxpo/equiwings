
import BlogDetails from "@/components/pages/blogs/blog-details";
import axiosInstance from "@/lib/config/axios";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const slug = (await params).slug;

    try {
        const response = await axiosInstance.get(`/customers/blogs/${slug}`);
        const blog = response.data.blog;
        return {
            title: blog.metaTitle || blog.title || "Blog title",
            description: blog.metaDescription || "Blog description",
            keywords: blog.metaKeywords || "Blog keywords",
        };
    } catch (error) {
        console.error("Failed to fetch blog:", error);
    }

    // Fallback metadata if API call fails
    return {
        title: "Equiwings - Blog",
        description: "Equiwings - Blog Description",
        keywords: "Equiwings, Blog, Keywords",
    };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    return <BlogDetails slug={slug} />;
}
