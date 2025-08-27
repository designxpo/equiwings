import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Product from "@/lib/models/Product"
import { authenticate, authorize } from "@/lib/middleware/auth"
import { uploadToS3 } from "@/lib/utils/s3"
import { generateProductId } from "../../helpers/product-id-generate"

// GET All products
export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request)
    await authorize(user, "PRODUCT", "READ")
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const isActive = searchParams.get("isActive")

    // Build query
    const query: any = {}

    if (category) {
      query.category = category.toUpperCase()
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { productId: { $regex: `^${search.toUpperCase()}` } },
      ]
    }

    if (isActive !== null) {
      query.isActive = isActive === "true"
    }

    // Execute query with pagination
    const skip = (page - 1) * limit
    const products = await Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await Product.countDocuments(query)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Get products error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: error.message === "Authentication failed" ? 401 : 500 },
    )
  }
}

// Create product
export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request)
    await authorize(user, "PRODUCT", "CREATE")
    await connectDB()

    const formData = await request.formData()

    // Extract product data
    const productData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      price: Number.parseFloat(formData.get("price") as string),
      quantity: Number.parseInt(formData.get("quantity") as string),
      sizes: JSON.parse((formData.get("sizes") as string) || "[]"),
      colors: JSON.parse((formData.get("colors") as string) || "[]"),
    }

    // Handle reviews and ratings
    const reviewsData = formData.get("reviews") as string
    const ratingsData = formData.get("ratings") as string

    let reviews: any[] = []
    let ratings = { average: 0, count: 0 }

    if (reviewsData) {
      try {
        const parsedReviews = JSON.parse(reviewsData || "[]")
        reviews = parsedReviews.map((review: any) => ({
          reviewerName: review.reviewerName,
          rating: review.rating,
          comment: review.comment,
          createdAt: new Date(),
        }))
      } catch (error) {
        console.error("Error parsing reviews:", error)
        reviews = []
      }
    }

    if (ratingsData) {
      try {
        const parsedRatings = JSON.parse(ratingsData || "{}")
        ratings = {
          average: parsedRatings.average || 0,
          count: parsedRatings.count || 0,
        }
      } catch (error) {
        console.error("Error parsing ratings:", error)
        ratings = { average: 0, count: 0 }
      }
    }

    // Handle main image upload
    const mainImageFile = formData.get("mainImage") as File
    if (!mainImageFile) {
      return NextResponse.json({ error: "Main image is required" }, { status: 400 })
    }

    const mainImageBuffer = Buffer.from(await mainImageFile.arrayBuffer())
    const mainImageUrl = await uploadToS3(mainImageBuffer, mainImageFile.name, mainImageFile.type)

    // Handle additional images
    const additionalImages: string[] = []
    const additionalImagesFiles = formData.getAll("additionalImages") as File[]
    for (let i = 0; i < additionalImagesFiles.length && i < 5; i++) {
      const imageFile = additionalImagesFiles[i]
      if (imageFile && imageFile.size > 0) {
        const imageBuffer = Buffer.from(await imageFile.arrayBuffer())
        const imageUrl = await uploadToS3(imageBuffer, imageFile.name, imageFile.type)
        additionalImages.push(imageUrl)
      }
    }

    // Generate unique product ID
    const productId = await generateProductId()

    // Create product with generated ID, reviews, and ratings
    const product = await Product.create({
      ...productData,
      productId,
      mainImage: mainImageUrl,
      additionalImages,
      reviews,
      ratings,
    })

    return NextResponse.json(
      {
        message: "Product created successfully",
        product,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Create product error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: error.message === "Authentication failed" ? 401 : 500 },
    )
  }
}
