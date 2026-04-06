import { SearchBar } from '@/components/registry/SearchBar'
import { SkillsetCard } from '@/components/registry/SkillsetCard'
import { searchSkillsets } from '@/lib/registry'

type Props = {
  searchParams: { q?: string; tier?: string; sort?: string; offset?: string; limit?: string }
}

export const metadata = {
  title: 'Skillsets — Skilldex Registry',
  description: 'Browse and search Claude skillset packages — curated bundles of skills for specific agent use-cases',
}

function buildHref(searchParams: Props['searchParams'], updates: Partial<Props['searchParams']>) {
  const merged = { ...searchParams, ...updates }
  const params = new URLSearchParams()
  if (merged.q) params.set('q', merged.q)
  if (merged.tier) params.set('tier', merged.tier)
  if (merged.sort && merged.sort !== 'installs') params.set('sort', merged.sort)
  if (merged.limit && merged.limit !== '20') params.set('limit', merged.limit)
  if (merged.offset && merged.offset !== '0') params.set('offset', merged.offset)
  return `/registry/skillsets${params.size ? `?${params.toString()}` : ''}`
}

export default async function SkillsetsPage({ searchParams }: Props) {
  const limit = Math.min(Math.max(Number(searchParams.limit) || 20, 1), 100)
  const offset = Math.max(Number(searchParams.offset) || 0, 0)

  const { skillsets, total } = await searchSkillsets({
    q: searchParams.q,
    tier: searchParams.tier,
    sort: searchParams.sort || 'installs',
    limit,
    offset,
  })

  const totalPages = Math.ceil(total / limit)
  const currentPage = Math.floor(offset / limit) + 1
  const firstItem = total === 0 ? 0 : offset + 1
  const lastItem = Math.min(offset + limit, total)

  function getPageNumbers() {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | '...')[] = []
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) {
      pages.push(p)
    }
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-2">
          Registry
        </p>
        <h1 className="text-2xl font-mono font-semibold text-text-primary">
          Browse skillsets
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Curated bundles of skills for specific agent use-cases.{' '}
          <a href="/registry" className="text-term-green hover:underline font-mono">
            Browse individual skills →
          </a>
        </p>
      </div>

      <div className="mb-6">
        <SearchBar
          defaultQ={searchParams.q}
          defaultTier={searchParams.tier}
          defaultSort={searchParams.sort}
          defaultLimit={limit}
          defaultTab="skillsets"
        />
      </div>

      {skillsets.length === 0 ? (
        <div className="border border-surface-border rounded-lg px-6 py-12 text-center">
          <p className="text-sm font-mono text-text-secondary mb-2">
            {searchParams.q || searchParams.tier
              ? 'No skillsets match your search.'
              : 'No skillsets published yet.'}
          </p>
          <p className="text-xs text-text-muted font-mono">
            Be the first — run{' '}
            <code className="text-term-green">skillpm skillset publish</code> from your skillset folder.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-mono text-text-muted">
              Showing {firstItem}–{lastItem} of {total} skillset{total !== 1 ? 's' : ''}
              {searchParams.q ? ` for "${searchParams.q}"` : ''}
            </p>
            {totalPages > 1 && (
              <p className="text-xs font-mono text-text-muted">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>

          <div className="divide-y divide-surface-border border border-surface-border rounded-lg overflow-hidden">
            {skillsets.map((ss) => (
              <SkillsetCard key={ss.name} skillset={ss} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <a
                href={currentPage > 1
                  ? buildHref(searchParams, { offset: String((currentPage - 2) * limit) })
                  : undefined}
                aria-disabled={currentPage === 1}
                className={`text-xs font-mono transition-colors ${
                  currentPage === 1
                    ? 'text-text-muted pointer-events-none'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                ← Previous
              </a>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((p, i) =>
                  p === '...' ? (
                    <span key={`ellipsis-${i}`} className="text-xs font-mono text-text-muted px-1">…</span>
                  ) : (
                    <a
                      key={p}
                      href={buildHref(searchParams, { offset: String((p - 1) * limit) })}
                      className={`text-xs font-mono w-7 h-7 flex items-center justify-center rounded transition-colors ${
                        p === currentPage
                          ? 'bg-surface-overlay text-text-primary border border-surface-border'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      {p}
                    </a>
                  )
                )}
              </div>

              <a
                href={currentPage < totalPages
                  ? buildHref(searchParams, { offset: String(currentPage * limit) })
                  : undefined}
                aria-disabled={currentPage === totalPages}
                className={`text-xs font-mono transition-colors ${
                  currentPage === totalPages
                    ? 'text-text-muted pointer-events-none'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Next →
              </a>
            </div>
          )}
        </>
      )}
    </main>
  )
}
