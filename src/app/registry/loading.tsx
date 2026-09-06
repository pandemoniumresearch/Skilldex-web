/**
 * Skeleton for the registry routes.
 *
 * Worth having beyond polish: the registry API is a network hop away and search over the
 * corpus is measurably slower than a curated browse, so without this the page simply hangs on
 * the previous view.
 */
export default function RegistryLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="h-3 w-32 bg-surface-raised rounded mb-3" />
      <div className="h-7 w-48 bg-surface-raised rounded mb-2" />
      <div className="h-4 w-64 bg-surface-raised rounded mb-8" />
      <div className="h-10 w-full bg-surface-raised rounded-lg mb-6" />

      <div className="divide-y divide-surface-border border border-surface-border rounded-lg overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-5 py-4">
            <div className="w-60 flex-none">
              <div className="h-4 w-32 bg-surface-raised rounded mb-1.5" />
              <div className="h-3 w-20 bg-surface-raised rounded" />
            </div>
            <div className="h-4 flex-1 bg-surface-raised rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
