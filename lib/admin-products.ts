import { ProductResponse } from "@/lib/type/product";

const BASE_URL = process.env.NEXT_FAKE_API;

export type ProductInput = {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
};

function getBaseUrl() {
  //error handling if Url doesn't work
  if (!BASE_URL) {
    throw new Error("API is not configured.");
  }
  return BASE_URL;
}

async function requestApi(
  path: string,
  init?: RequestInit,
  errorMessage?: string,
): Promise<unknown> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(
      `${errorMessage ?? "API request failed"}${responseText ? `: ${responseText}` : ""}`,
    );
  }

  if (response.status === 204) {
    return undefined;
  }

  return await response.json();
}

// Fetch Product from API
export async function getProducts(): Promise<ProductResponse[]> {
  const data = await requestApi(
    "/api/v1/products",
    { method: "GET" },
    "Failed to fetch products",
  );
  return data as ProductResponse[];
}

// Create Product
export async function createProduct(
  input: ProductInput,
): Promise<ProductResponse> {
  const data = await requestApi(
    "/api/v1/products",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    "Failed to create product",
  );
  return data as ProductResponse;
}

// Update Product
export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<ProductResponse> {
  const data = await requestApi(
    `/api/v1/products/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
    `Failed to update product `,
  );
  return data as ProductResponse;
}

// Delete Product
export async function deleteProduct(id: string): Promise<void> {
  await requestApi(
    `/api/v1/products/${id}`,
    { method: "DELETE" },
    `Failed to delete product`,
  );
}
