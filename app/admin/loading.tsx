export default function AdminLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <section className="space-y-8">
        <div className="h-56 animate-pulse rounded-3xl bg-slate-200/70 dark:bg-slate-800/70" />

        <div className="grid gap-8 xl:items-start xl:grid-cols-[1fr_320px]">
          <div className="h-[560px] animate-pulse rounded-2xl border bg-slate-200/70 dark:bg-slate-800/70" />
          <div className="h-fit space-y-3 rounded-2xl border bg-card p-5 shadow-sm">
            <div className="h-8 w-40 animate-pulse rounded bg-slate-200/70 dark:bg-slate-800/70" />
            <div className="h-4 w-56 animate-pulse rounded bg-slate-200/70 dark:bg-slate-800/70" />
            <div className="h-10 animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800/70" />
            <div className="h-24 animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800/70" />
            <div className="h-10 animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800/70" />
            <div className="h-10 animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800/70" />
            <div className="h-10 animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800/70" />
            <div className="h-10 animate-pulse rounded-lg bg-slate-200/70 dark:bg-slate-800/70" />
          </div>
        </div>
      </section>
    </main>
  );
}
