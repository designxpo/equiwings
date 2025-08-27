import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Product from "@/lib/models/Product"
import { authenticate, authorize } from "@/lib/middleware/auth"
import { uploadToS3 } from "@/lib/utils/s3"

// Get single product
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await authenticate(request)
        await authorize(user, "PRODUCT", "READ")
        await connectDB()

        const { id } = await params

        // Check if product exists
        const existingProduct = await Product.findById(id)
        if (!existingProduct) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                message: "Product retrieved successfully",
                product: existingProduct,
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error("Get product error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to retrieve product" },
            { status: error.message === "Authentication failed" ? 401 : 500 }
        )
    }
}

// Update product
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await authenticate(request)
    await authorize(user, "PRODUCT", "UPDATE")
    await connectDB()

    const { id } = await params

    // Check if product exists
    const existingProduct = await Product.findById(id)
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const formData = await request.formData()

    // Build update object
    const updateData: any = {}

    // Handle text fields
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const price = formData.get("price") as string
    const quantity = formData.get("quantity") as string
    const sizes = formData.get("sizes") as string
    const colors = formData.get("colors") as string
    const isActive = formData.get("isActive") as string
    const reviews = formData.get("reviews") as string
    const ratings = formData.get("ratings") as string

    if (name !== null) updateData.name = name
    if (description !== null) updateData.description = description
    if (category !== null) updateData.category = category.toUpperCase()
    if (price !== null) updateData.price = Number.parseFloat(price)
    if (quantity !== null) updateData.quantity = Number.parseInt(quantity)
    if (sizes !== null) updateData.sizes = JSON.parse(sizes || "[]")
    if (colors !== null) updateData.colors = JSON.parse(colors || "[]")
    if (isActive !== null) updateData.isActive = isActive === "true"

    // Handle reviews and ratings
    if (reviews !== null) {
      try {
        const parsedReviews = JSON.parse(reviews || "[]")
        updateData.reviews = parsedReviews.map((review: any) => ({
          reviewerName: review.reviewerName,
          rating: review.rating,
          comment: review.comment,
          createdAt: new Date(),
        }))
      } catch (error) {
        console.error("Error parsing reviews:", error)
        updateData.reviews = []
      }
    }

    if (ratings !== null) {
      try {
        const parsedRatings = JSON.parse(ratings || "{}")
        updateData.ratings = {
          average: parsedRatings.average || 0,
          count: parsedRatings.count || 0,
        }
      } catch (error) {
        console.error("Error parsing ratings:", error)
        updateData.ratings = {
          average: 0,
          count: 0,
        }
      }
    }

    // Handle main image upload if provided
    const mainImageFile = formData.get("mainImage") as File
    if (mainImageFile && mainImageFile.size > 0) {
      const mainImageBuffer = Buffer.from(await mainImageFile.arrayBuffer())
      const mainImageUrl = await uploadToS3(mainImageBuffer, mainImageFile.name, mainImageFile.type)
      updateData.mainImage = mainImageUrl
    }

    // Handle additional images if provided
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

    // Only update additional images if new ones were provided
    if (additionalImages.length > 0) {
      updateData.additionalImages = additionalImages
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

    return NextResponse.json(
      {
        message: "Product updated successfully",
        product: updatedProduct,
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Update product error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: error.message === "Authentication failed" ? 401 : 500 },
    )
  }
}

// Delete product
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await authenticate(request)
        await authorize(user, "PRODUCT", "DELETE")
        await connectDB()

        const { id } = await params

        // Check if product exists
        const existingProduct = await Product.findById(id)
        if (!existingProduct) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            )
        }

        // Delete the product
        await Product.findByIdAndDelete(id)

        return NextResponse.json(
            { message: "Product deleted successfully" },
            { status: 200 }
        )
    } catch (error: any) {
        console.error("Delete product error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to delete product" },
            { status: error.message === "Authentication failed" ? 401 : 500 }
        )
    }
}

// Add review to product
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await authenticate(request)
        await authorize(user, "PRODUCT", "UPDATE")
        await connectDB()

        const { id } = await params
        const body = await request.json()
        const { action, ...data } = body

        // Check if product exists
        const existingProduct = await Product.findById(id)
        if (!existingProduct) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            )
        }

        // Handle different actions
        switch (action) {
            case "ADD_REVIEW": {
                const { reviewerName, rating, comment } = data

                // Validate review data
                if (!reviewerName || !rating || !comment) {
                    return NextResponse.json(
                        { error: "Reviewer name, rating, and comment are required" },
                        { status: 400 }
                    )
                }

                if (rating < 1 || rating > 5) {
                    return NextResponse.json(
                        { error: "Rating must be between 1 and 5" },
                        { status: 400 }
                    )
                }

                // Add review to product
                const newReview = {
                    reviewerName,
                    rating,
                    comment,
                    createdAt: new Date()
                }

                existingProduct.reviews.push(newReview)

                // Update ratings
                existingProduct.updateRatings()

                // Save the product
                await existingProduct.save()

                return NextResponse.json(
                    {
                        message: "Review added successfully",
                        product: existingProduct,
                    },
                    { status: 200 }
                )
            }

            case "TOGGLE_STATUS": {
                const { isActive } = data

                if (typeof isActive !== "boolean") {
                    return NextResponse.json(
                        { error: "isActive must be a boolean value" },
                        { status: 400 }
                    )
                }

                // Update product status
                existingProduct.isActive = isActive
                await existingProduct.save()

                return NextResponse.json(
                    {
                        message: `Product ${isActive ? "activated" : "deactivated"} successfully`,
                        product: existingProduct,
                    },
                    { status: 200 }
                )
            }

            default:
                return NextResponse.json(
                    { error: "Invalid action specified" },
                    { status: 400 }
                )
        }
    } catch (error: any) {
        console.error("Product patch error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to update product" },
            { status: error.message === "Authentication failed" ? 401 : 500 }
        )
    }
}