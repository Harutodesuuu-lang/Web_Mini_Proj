"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="container mx-auto py-12">
      <section className="mx-auto max-w-xl rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <h1 className="mb-2 text-2xl font-semibold text-red-700">
          Failed to load products
        </h1>
        <p className="mb-6 text-red-600">
          Something went wrong while loading data. Try again.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => reset()}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Retry
          </button>
          <Link
            href="/"
            className="rounded-md border border-red-400 px-4 py-2 text-red-700 hover:bg-red-100"
          >
            Back Home
          </Link>
        </div>
      </section>
    </main>
  );
}
