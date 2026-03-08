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

async function requestFakeApi<T>(
  path: string,
  init?: RequestInit,
  errorMessage?: string,
): Promise<T> {
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
    throw new Error(`${errorMessage ?? "API request failed"}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

// Fetch Product from API
export async function getProducts(): Promise<ProductResponse[]> {
  return requestFakeApi<ProductResponse[]>(
    "/api/v1/products",
    { method: "GET" },
    "Failed to fetch products",
  );
}

// Create Product
export async function createProduct(
  input: ProductInput,
): Promise<ProductResponse> {
  return requestFakeApi<ProductResponse>(
    "/api/v1/products",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    "Failed to create product",
  );
}

// Update Product
export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<ProductResponse> {
  return requestFakeApi<ProductResponse>(
    `/api/v1/products/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    },
    `Failed to update product ${id}`,
  );
}

// Delete Product
export async function deleteProduct(id: string): Promise<void> {
  await requestFakeApi<unknown>(
    `/api/v1/products/${id}`,
    { method: "DELETE" },
    `Failed to delete product ${id}`,
  );
}
