import { createProduct, getProducts, ProductInput } from "@/lib/admin-products";
import { NextResponse } from "next/server";

function validateProductInput(input: unknown): ProductInput {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid payload.");
  }

  const candidate = input as Record<string, unknown>;
  const title = String(candidate.title ?? "").trim();
  const description = String(candidate.description ?? "").trim();
  const price = Number(candidate.price);
  const categoryId = Number(candidate.categoryId);
  const images = Array.isArray(candidate.images)
    ? candidate.images.filter((item): item is string => typeof item === "string")
    : [];

  if (!title) throw new Error("Title is required.");
  if (!description) throw new Error("Description is required.");
  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Price must be greater than 0.");
  }
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    throw new Error("Category ID must be a positive integer.");
  }
  if (images.length === 0) throw new Error("At least one image URL is required.");

  return {
    title,
    description,
    price,
    categoryId,
    images: images.map((item) => item.trim()).filter(Boolean),
  };
}

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load products.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = validateProductInput(await request.json());
    const product = await createProduct(payload);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create product.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
