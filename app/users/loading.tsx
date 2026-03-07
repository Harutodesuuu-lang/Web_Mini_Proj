import { SkeletonUserCard } from "@/components/user-skeleton";

export default function UserLoading() {
  return (
    <main className="container mx-auto">
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(15)].map((_, index) => (
          <SkeletonUserCard key={index} />
        ))}
      </section>
    </main>
  );
}
