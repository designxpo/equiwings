import Product from "@/lib/models/Product"

export async function generateProductId() {
    try {
        // Find the last product by creation date
        const lastProduct = await Product.findOne({})
            .sort({ createdAt: -1 })
            .select('productId')
            .lean()
            .exec() as { productId: string } | null

        let nextNumber = 1 // Start from 1 if no products exist

        if (lastProduct && lastProduct.productId) {
            // Extract number from productId using regex
            // Handles formats like PREQ0001, PREQ001, PREQ1, etc.
            const match = lastProduct.productId.match(/PREQ0*(\d+)$/)
            if (match && match[1]) {
                nextNumber = parseInt(match[1], 10) + 1
            }
        }

        // Generate ID with 4-digit padding (PREQ0001, PREQ0002, etc.)
        const productId = `PREQ${nextNumber.toString().padStart(4, '0')}`

        return productId
    } catch (error) {
        console.error('Error generating product ID:', error)
        throw new Error('Failed to generate product ID')
    }
}