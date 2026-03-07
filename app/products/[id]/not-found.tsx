import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="container mx-auto py-12">
      <section className="mx-auto max-w-xl rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
        <h1 className="mb-2 text-2xl font-semibold text-amber-700">
          Product not found
        </h1>
        <p className="mb-6 text-amber-700">
          The product you are looking for does not exist or was removed.
        </p>
        <Link
          href="/products"
          className="inline-block rounded-md bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
        >
          Back to products
        </Link>
      </section>
    </main>
  );
}
