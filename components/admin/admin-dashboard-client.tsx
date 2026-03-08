"use client";

import { Category, ProductResponse } from "@/lib/type/product";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type AdminStats = {
  totalProducts: number;
  totalCategories: number;
};

type AdminDashboardClientProps = {
  initialProducts: ProductResponse[];
  stats: AdminStats;
};

const formSchema = z.object({
  title: z.string().trim().min(1, "Title is required atleas."),
  description: z
    .string()
    .trim()
    .min(5, "Description is required atleast 5 chatacters."),
  price: z.coerce
    .number({
      invalid_type_error: "This field must be a number",
    })
    .min(1, { message: "This field is required" }),
  categoryId: z.preprocess(
    (v) => Number(v),
    z.number().int().positive("Category is required"),
  ),
  images: z
    .custom<FileList | null>()
    .refine((files) => files && files.length > 0, "Please choose an image"),
});

type ProductFormValues = z.infer<typeof formSchema>;

const EMPTY_FORM: ProductFormValues = {
  title: "",
  description: "",
  price: 0,
  categoryId: 0,
  images: null,
};

const baseAPI =
  process.env.NEXT_PUBLIC_API ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api.escuelajs.co";

async function uploadImageToServer(file: File): Promise<{ location: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${baseAPI}/api/v1/files/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${res.status} ${text}`);
  }

  return (await res.json()) as { location: string };
}

async function insertProduct(payload: {
  title: string;
  description: string;
  price: number;
  categoryId: number;
  images: string[];
}): Promise<ProductResponse> {
  const res = await fetch(`${baseAPI}/api/v1/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Insert product failed: ${res.status} ${text}`);
  }

  return (await res.json()) as ProductResponse;
}

async function updateProduct(
  id: string,
  payload: {
    title: string;
    description: string;
    price: number;
    categoryId: number;
    images: string[];
  },
): Promise<ProductResponse> {
  const res = await fetch(`${baseAPI}/api/v1/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Update product failed: ${res.status} ${text}`);
  }

  return (await res.json()) as ProductResponse;
}

async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${baseAPI}/api/v1/products/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Delete product failed: ${res.status} ${text}`);
  }
}

function getCategoryId(product: ProductResponse) {
  return product.category?.id ?? 0;
}

function extractCategories(products: ProductResponse[]): Category[] {
  const byId = new Map<number, Category>();
  products.forEach((product) => {
    if (product.category?.id && product.category?.name) {
      byId.set(product.category.id, product.category);
    }
  });
  return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function compactCategoryLabel(name: string) {
  const cleaned = name.replace(/[\r\n\t]/g, " ").trim();
  return cleaned.length > 28 ? `${cleaned.slice(0, 28)}...` : cleaned;
}

function mapUploadErrorMessage(message: string) {
  const normalized = message.toLowerCase();
  if (
    normalized.includes("already exist") ||
    normalized.includes("unique") ||
    normalized.includes("sqlite_constraint") ||
    normalized.includes("product.slug")
  ) {
    return "Product already exist.";
  }
  return "Product fail to upload.";
}

export default function AdminDashboardClient({
  initialProducts,
  stats,
}: AdminDashboardClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>(
    extractCategories(initialProducts),
  );
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [feedback, setFeedback] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY_FORM,
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`${baseAPI}/api/v1/categories`);
        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = (await res.json()) as Category[];
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      } catch (loadError) {
        console.error(loadError);
        setCategories((prev) =>
          prev.length > 0 ? prev : extractCategories(initialProducts),
        );
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, [initialProducts]);

  useEffect(() => {
    if (!feedback) return;
    const timeout = setTimeout(() => setFeedback(""), 5000);
    return () => clearTimeout(timeout);
  }, [feedback]);

  useEffect(() => {
    if (!error) return;
    const timeout = setTimeout(() => setError(""), 5000);
    return () => clearTimeout(timeout);
  }, [error]);

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return products;

    return products.filter((item) => {
      const bag =
        `${item.title} ${item.description} ${item.category?.name ?? ""}`.toLowerCase();
      return bag.includes(query);
    });
  }, [products, search]);

  function onReset() {
    form.reset(EMPTY_FORM);
    setEditingId(null);
    setFileInputKey((current) => current + 1);
  }

  function preparePayload(values: ProductFormValues) {
    return {
      title: values.title.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      categoryId: Number(values.categoryId),
      images: [],
    };
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      setError("");
      setFeedback("");

      try {
        const filesArray = Array.from(values.images);
        const uploaded = await Promise.all(
          filesArray.map((file) => uploadImageToServer(file)),
        );
        const imageUrls = uploaded.map((item) => item.location);
        const payload = {
          ...preparePayload(values),
          images: imageUrls,
        };
        const isEdit = editingId !== null;
        const data = isEdit
          ? await updateProduct(String(editingId), payload)
          : await insertProduct(payload);

        if (isEdit) {
          setProducts((prev) =>
            prev.map((item) =>
              item.id === editingId ? (data as ProductResponse) : item,
            ),
          );
          setFeedback("Product updated successfully.");
        } else {
          setProducts((prev) => [data as ProductResponse, ...prev]);
          setFeedback("Product created successfully.");
        }

        onReset();
      } catch (saveError) {
        const rawMessage =
          saveError instanceof Error ? saveError.message : "Unknown error";
        setError(mapUploadErrorMessage(rawMessage));
      }
    });
  }

  function onEdit(product: ProductResponse) {
    setEditingId(product.id);
    form.reset({
      title: product.title,
      description: product.description,
      price: product.price,
      categoryId: getCategoryId(product),
      images: null,
    });
    setFeedback("");
    setError("");
  }

  function onDelete(productId: number) {
    startTransition(async () => {
      setError("");
      setFeedback("");

      try {
        await deleteProduct(String(productId));

        setProducts((prev) => prev.filter((item) => item.id !== productId));
        setFeedback("Product deleted successfully.");
        if (editingId === productId) {
          onReset();
        }
      } catch (deleteError) {
        setError(
          deleteError instanceof Error
            ? deleteError.message
            : "Failed to delete product.",
        );
      }
    });
  }

  return (
    <section className="space-y-8">
      <div className="rounded-3xl  from-slate-900 via-sky-800 to-cyan-700 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-cyan-100">
              Upload, Update, View and Delete Product
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex w-full items-center justify-center rounded-md border border-white/40 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 sm:w-auto"
          >
            Browse Products
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-wide text-cyan-100">
              Total Products
            </p>
            <p className="mt-1 text-2xl font-semibold">{stats.totalProducts}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-wide text-cyan-100">
              Categories
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {stats.totalCategories}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:items-start xl:grid-cols-[1fr_320px]">
        <div className="order-2 rounded-2xl border bg-card p-5 shadow-sm xl:order-1">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold">Product Inventory</h2>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product, category..."
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm sm:max-w-xs"
            />
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="px-3 py-3">Product</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3">Price</th>
                  <th className="px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="px-3 py-3 align-top">
                      <p className="font-medium">{product.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {product.description}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      {product.category?.name ?? "N/A"}
                    </td>
                    <td className="px-3 py-3">${product.price}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="rounded-md border px-3 py-1.5 text-xs hover:bg-accent"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => onEdit(product)}
                          className="rounded-md border px-3 py-1.5 text-xs hover:bg-accent"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {filteredProducts.map((product) => (
              <article key={product.id} className="rounded-xl border p-4">
                <div className="space-y-2">
                  <p className="line-clamp-1 font-medium">{product.title}</p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {product.description}
                  </p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="font-medium">
                      {product.category?.name ?? "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="font-medium">${product.price}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="rounded-md border px-3 py-1.5 text-xs hover:bg-accent"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => onEdit(product)}
                    className="rounded-md border px-3 py-1.5 text-xs hover:bg-accent"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="order-1 h-fit self-start rounded-2xl border bg-card p-5 shadow-sm xl:order-2">
          <h2 className="text-xl font-semibold">
            {editingId === null
              ? "Create Product"
              : `Edit Product #${editingId}`}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Choose one or more images from your device.
          </p>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            onReset={onReset}
            className="mt-4 space-y-4"
          >
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <label htmlFor="title" className="text-sm font-medium">
                    Product Title
                  </label>
                  <input
                    id="title"
                    placeholder="Macbook Pro 16 inch"
                    type="text"
                    {...field}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  />
                  {fieldState.invalid ? (
                    <p className="text-xs text-red-600">
                      {fieldState.error?.message}
                    </p>
                  ) : null}
                </div>
              )}
            />

            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <label htmlFor="description" className="text-sm font-medium">
                    Product Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Product description"
                    {...field}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  />
                  {fieldState.invalid ? (
                    <p className="text-xs text-red-600">
                      {fieldState.error?.message}
                    </p>
                  ) : null}
                </div>
              )}
            />

            <Controller
              control={form.control}
              name="price"
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <label htmlFor="price" className="text-sm font-medium">
                    Price
                  </label>
                  <input
                    id="price"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="2000"
                    value={field.value}
                    onChange={(event) => field.onChange(event.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  />
                  {fieldState.invalid ? (
                    <p className="text-xs text-red-600">
                      {fieldState.error?.message}
                    </p>
                  ) : null}
                </div>
              )}
            />

            <Controller
              control={form.control}
              name="categoryId"
              render={({ field, fieldState }) => (
                <div
                  className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start"
                  data-invalid={fieldState.invalid}
                >
                  <label
                    htmlFor="categoryId"
                    className="flex w-auto text-sm font-medium"
                  >
                    Category
                  </label>
                  <select
                    id="categoryId"
                    value={String(field.value)}
                    onChange={(event) => field.onChange(event.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    disabled={loadingCategories || categories.length === 0}
                    className="w-full border-gray-400 rounded-lg border bg-background px-3 py-2 text-sm disabled:opacity-60"
                  >
                    <option value="0">
                      {loadingCategories
                        ? "Loading categories..."
                        : "Select category"}
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {compactCategoryLabel(category.name)}
                      </option>
                    ))}
                  </select>
                  {fieldState.invalid ? (
                    <p className="text-xs text-red-600">
                      {fieldState.error?.message}
                    </p>
                  ) : null}
                </div>
              )}
            />

            <Controller
              control={form.control}
              name="images"
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <label htmlFor="images" className="text-sm font-medium">
                    Images
                  </label>
                  <input
                    key={fileInputKey}
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => field.onChange(event.target.files)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  />
                  {fieldState.invalid ? (
                    <p className="text-xs text-red-600">
                      {fieldState.error?.message}
                    </p>
                  ) : null}
                </div>
              )}
            />

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                disabled={isPending}
                type="submit"
                className="w-full flex-1 rounded-md bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending
                  ? editingId === null
                    ? "Saving..."
                    : "Updating..."
                  : editingId === null
                    ? "Create"
                    : "Update"}
              </button>
              <button
                type="reset"
                className="w-full rounded-md border px-4 py-2 text-sm hover:bg-accent sm:w-auto"
              >
                Clear
              </button>
            </div>
          </form>

          {feedback ? (
            <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {feedback}
            </p>
          ) : null}
          {error ? (
            <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
