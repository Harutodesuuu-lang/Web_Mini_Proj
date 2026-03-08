"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleRetry = () => {
    reset();
    router.refresh();
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <section className="mx-auto max-w-xl rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <h1 className="mb-2 text-2xl font-semibold text-red-700">
          Admin dashboard failed to load
        </h1>
        <p className="mb-6 text-red-600">
          We could not load product data from the Fake Shop API.
        </p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={handleRetry}
            className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 active:scale-[0.99]"
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
