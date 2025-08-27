import ProductDescription from "@/components/pages/sports-retail/view"

export default async function Page({
    params,
}: {
    params: Promise<{ productId: string }>
}) {
    const { productId } = await params;
    return (
        <ProductDescription productId={productId} />
    )
}