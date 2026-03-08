export default function AdminLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <section className="space-y-6">
        <div className="h-40 animate-pulse rounded-3xl bg-slate-200/70 dark:bg-slate-800/70" />
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="h-[420px] animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/70" />
          <div className="h-[420px] animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/70" />
        </div>
      </section>
    </main>
  );
}
