export const fetchSingleProduct = async (id: string) => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/getSingleProduct?id=${id}`
    )
    const data = await res.json();
    const product: Product = data.product[0];

    return product;
}