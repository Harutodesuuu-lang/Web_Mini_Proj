import { ProductResponse } from "@/lib/type/product";
import Image from "next/image";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_FAKE_API;

async function getProductById(id: string) {
  if (!BASE_URL) {
    throw new Error("API is not configured.");
  }

  const data = await fetch(`${BASE_URL}/api/v1/products/${id}`);

  if (data.status === 404) {
    notFound();
  }

  if (!data.ok) {
    throw new Error(`Failed to get product ${id}.`);
  }

  const product: unknown = await data.json();
  if (!product || typeof product !== "object") {
    throw new Error("Unexpected product error.");
  }

  return product;
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product: ProductResponse = await getProductById(id);
  const firstImage = product.images?.[0];

  if (!firstImage) {
    throw new Error("Product image is missing.");
  }

  return (
    <main>
      <section className="text-center grid items-center">
        <h1>Product Detail Page {id}</h1>
        <h2>{product.title}</h2>
        <h2>{product.slug}</h2>
        <h2>{product.category.name}</h2>
        <Image
          src={firstImage}
          alt="product.img"
          width={500}
          height={500}
          className="mx-auto"
        />
        <h2>{product.price} USD</h2>
        <h2>{product.description}</h2>
      </section>
    </main>
  );
}
