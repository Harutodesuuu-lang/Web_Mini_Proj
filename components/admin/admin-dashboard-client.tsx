"use client";

import { ProductResponse } from "@/lib/type/product";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

type AdminStats = {
  totalProducts: number;
  totalCategories: number;
  avgPrice: number;
  topPrice: number;
};

type AdminDashboardClientProps = {
  initialProducts: ProductResponse[];
  stats: AdminStats;
};

type ProductFormState = {
  title: string;
  description: string;
  price: string;
  categoryId: string;
  images: string;
};

const EMPTY_FORM: ProductFormState = {
  title: "",
  description: "",
  price: "",
  categoryId: "1",
  images: "",
};

function normalizeImages(value: string) {
  return value
    .split(/[\n,]/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getCategoryId(product: ProductResponse) {
  return String(product.category?.id ?? 1);
}

export default function AdminDashboardClient({
  initialProducts,
  stats,
}: AdminDashboardClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return products;

    return products.filter((item) => {
      const bag =
        `${item.title} ${item.description} ${item.category?.name ?? ""}`.toLowerCase();
      return bag.includes(query);
    });
  }, [products, search]);

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function preparePayload() {
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      categoryId: Number(form.categoryId),
      images: normalizeImages(form.images),
    };

    if (!payload.title) throw new Error("Title is required.");
    if (!payload.description) throw new Error("Description is required.");
    if (!Number.isFinite(payload.price) || payload.price <= 0) {
      throw new Error("Price must be greater than 0.");
    }
    if (!Number.isInteger(payload.categoryId) || payload.categoryId <= 0) {
      throw new Error("Category ID must be a positive integer.");
    }
    if (payload.images.length === 0) {
      throw new Error("At least one image URL is required.");
    }

    return payload;
  }

  function onCreate() {
    startTransition(async () => {
      setError("");
      setFeedback("");

      try {
        const payload = preparePayload();
        const response = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message ?? "Unable to create product.");
        }

        setProducts((prev) => [data as ProductResponse, ...prev]);
        setFeedback("Product created successfully.");
        resetForm();
      } catch (createError) {
        setError(
          createError instanceof Error
            ? createError.message
            : "Failed to create product.",
        );
      }
    });
  }

  function onEdit(product: ProductResponse) {
    setEditingId(product.id);
    setForm({
      title: product.title,
      description: product.description,
      price: String(product.price),
      categoryId: getCategoryId(product),
      images: product.images.join(", "),
    });
    setFeedback("");
    setError("");
  }

  function onUpdate() {
    if (editingId === null) return;

    startTransition(async () => {
      setError("");
      setFeedback("");

      try {
        const payload = preparePayload();
        const response = await fetch(`/api/admin/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message ?? "Unable to update product.");
        }

        setProducts((prev) =>
          prev.map((item) => (item.id === editingId ? (data as ProductResponse) : item)),
        );
        setFeedback("Product updated successfully.");
        resetForm();
      } catch (updateError) {
        setError(
          updateError instanceof Error
            ? updateError.message
            : "Failed to update product.",
        );
      }
    });
  }

  function onDelete(productId: number) {
    startTransition(async () => {
      setError("");
      setFeedback("");

      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message ?? "Unable to delete product.");
        }

        setProducts((prev) => prev.filter((item) => item.id !== productId));
        setFeedback("Product deleted successfully.");
        if (editingId === productId) {
          resetForm();
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
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-sky-800 to-cyan-700 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-cyan-100">
              Manage products with full CRUD operations powered by Fake Shop API.
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
            <p className="mt-1 text-2xl font-semibold">{stats.totalCategories}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-wide text-cyan-100">
              Avg Price
            </p>
            <p className="mt-1 text-2xl font-semibold">${stats.avgPrice}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-wide text-cyan-100">
              Highest Price
            </p>
            <p className="mt-1 text-2xl font-semibold">${stats.topPrice}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
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
                    <td className="px-3 py-3">{product.category?.name ?? "N/A"}</td>
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
                    <p className="font-medium">{product.category?.name ?? "N/A"}</p>
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

        <aside className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="text-xl font-semibold">
            {editingId === null ? "Create Product" : `Edit Product #${editingId}`}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Images can be separated by commas or new lines.
          </p>

          <div className="mt-4 space-y-3">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              rows={4}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="Price"
              value={form.price}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, price: event.target.value }))
              }
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
            <input
              type="number"
              min="1"
              step="1"
              placeholder="Category ID"
              value={form.categoryId}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, categoryId: event.target.value }))
              }
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Image URL(s)"
              value={form.images}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, images: event.target.value }))
              }
              rows={3}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            {editingId === null ? (
              <button
                disabled={isPending}
                onClick={onCreate}
                className="w-full flex-1 rounded-md bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Saving..." : "Create"}
              </button>
            ) : (
              <button
                disabled={isPending}
                onClick={onUpdate}
                className="w-full flex-1 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Updating..." : "Update"}
              </button>
            )}
            <button
              onClick={resetForm}
              className="w-full rounded-md border px-4 py-2 text-sm hover:bg-accent sm:w-auto"
            >
              Clear
            </button>
          </div>

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
