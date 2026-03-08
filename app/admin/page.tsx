import AdminDashboardClient from "@/components/admin/admin-dashboard-client";
import { getProducts } from "@/lib/admin-products";

function buildStats(products: Awaited<ReturnType<typeof getProducts>>) {
  const totalProducts = products.length;
  const uniqueCategories = new Set(
    products
      .map((product) => product.category?.name)
      .filter((value): value is string => Boolean(value)),
  );
  const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
  const avgPrice =
    totalProducts === 0 ? 0 : Number((totalPrice / totalProducts).toFixed(2));
  const topPrice = products.reduce(
    (maxPrice, product) => Math.max(maxPrice, product.price),
    0,
  );

  return {
    totalProducts,
    totalCategories: uniqueCategories.size,
    avgPrice,
    topPrice,
  };
}

export default async function AdminPage() {
  const products = await getProducts();
  const stats = buildStats(products);

  return (
    <main className="container mx-auto px-4 py-8">
      <AdminDashboardClient initialProducts={products} stats={stats} />
    </main>
  );
}
