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
    <main className="container mx-auto">
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {data.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id}>
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
