import { SkeletonCard } from "@/components/skeleton-card";

export default function ProductLoading() {
  return (
    <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {[...Array(15)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </section>
    </main>
  );
}
