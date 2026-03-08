import { CardImage } from "@/components/product-card";
import { ProductResponse } from "@/lib/type/product";
import Link from "next/link";

const BASE_URL = process.env.NEXT_FAKE_API;

async function getProduct(): Promise<ProductResponse[]> {
  if (!BASE_URL) {
    throw new Error("API is not configured.");
  }

  const response = await fetch(`${BASE_URL}/api/v1/products/`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to get products.`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Unexpected products error.");
  }

  return data;
}

export default async function ProductPage() {
  const data = await getProduct();

  return (
    <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {data.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id} className="block h-full">
            <CardImage
              images={product.images}
              title={product.title}
              category={{
                name: product.category.name,
              }}
              description={product.description}
              price={product.price}
            />
          </Link>
        ))}
      </section>
    </main>
  );
}
