import { SearchBar } from '@/components/registry/SearchBar'
import { SkillCard } from '@/components/registry/SkillCard'
import { SkillsetCard } from '@/components/registry/SkillsetCard'
import { searchSkills, searchSkillsets } from '@/lib/registry'

type Props = {
  searchParams: { q?: string; tier?: string; sort?: string; offset?: string; limit?: string; tab?: string }
}

export const metadata = {
  title: 'Registry — Skilldex',
  description: 'Browse and search Claude skill packages',
}

function buildHref(searchParams: Props['searchParams'], updates: Partial<Props['searchParams']>) {
  const merged = { ...searchParams, ...updates }
  const params = new URLSearchParams()
  if (merged.tab && merged.tab !== 'skills') params.set('tab', merged.tab)
  if (merged.q) params.set('q', merged.q)
  if (merged.tier) params.set('tier', merged.tier)
  if (merged.sort && merged.sort !== 'installs') params.set('sort', merged.sort)
  if (merged.limit && merged.limit !== '20') params.set('limit', merged.limit)
  if (merged.offset && merged.offset !== '0') params.set('offset', merged.offset)
  return `/registry${params.size ? `?${params.toString()}` : ''}`
}

export default async function RegistryPage({ searchParams }: Props) {
  const tab = searchParams.tab === 'skillsets' ? 'skillsets' : 'skills'
  const limit = Math.min(Math.max(Number(searchParams.limit) || 20, 1), 100)
  const offset = Math.max(Number(searchParams.offset) || 0, 0)

  const searchOpts = {
    q: searchParams.q,
    tier: searchParams.tier,
    sort: searchParams.sort || 'installs',
    limit,
    offset,
  }

  const [{ skills, total: skillTotal }, { skillsets, total: skillsetTotal }] = await Promise.all([
    tab === 'skills' ? searchSkills(searchOpts) : Promise.resolve({ skills: [], total: 0 }),
    tab === 'skillsets' ? searchSkillsets(searchOpts) : Promise.resolve({ skillsets: [], total: 0 }),
  ])

  const items = tab === 'skills' ? skills : skillsets
  const total = tab === 'skills' ? skillTotal : skillsetTotal

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

  const tabHref = (t: string) => buildHref({ ...searchParams, tab: t }, { offset: '0' })
  const noun = tab === 'skillsets' ? 'skillset' : 'skill'
  const publishCmd = tab === 'skillsets' ? 'skillpm skillset publish' : 'skillpm publish'

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-2">
          skilldex / registry
        </p>
        <h1 className="text-2xl font-mono font-semibold text-text-primary mb-1">
          Browse {tab}
        </h1>
        <p className="text-sm text-text-secondary">
          {total > 0
            ? `${total} ${noun}${total !== 1 ? 's' : ''} available${searchParams.q ? ` for "${searchParams.q}"` : ''}`
            : `Discover and install Claude Code ${noun}s from the community`}
        </p>
      </div>

      {/* Pill tab switcher */}
      <div className="inline-flex items-center gap-1 bg-surface-raised border border-surface-border rounded-lg p-1 mb-6">
        {(['skills', 'skillsets'] as const).map((t) => (
          <a
            key={t}
            href={tabHref(t)}
            className={`text-xs font-mono px-4 py-1.5 rounded-md transition-all capitalize ${
              tab === t
                ? 'bg-surface-overlay text-text-primary border border-brand/20'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {t}
          </a>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar
          defaultQ={searchParams.q}
          defaultTier={searchParams.tier}
          defaultSort={searchParams.sort}
          defaultLimit={limit}
          defaultTab={tab}
        />
      </div>

      {items.length === 0 ? (
        <div className="border border-surface-border rounded-lg px-6 py-16 text-center bg-surface-raised/50">
          <div className="w-12 h-12 rounded-full bg-surface-overlay border border-surface-border flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-sm font-mono text-text-secondary mb-2">
            {searchParams.q || searchParams.tier
              ? `No ${noun}s match your search.`
              : `No ${noun}s published yet.`}
          </p>
          <p className="text-xs text-text-muted font-mono">
            Be the first — run <code className="text-text-secondary bg-surface-overlay px-1.5 py-0.5 rounded">{publishCmd}</code> from your {noun} folder.
          </p>
        </div>
      ) : (
        <>
          {/* Results info */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-mono text-text-muted">
              {firstItem}–{lastItem} of {total} {noun}{total !== 1 ? 's' : ''}
              {searchParams.q ? ` for "${searchParams.q}"` : ''}
            </p>
            {totalPages > 1 && (
              <p className="text-xs font-mono text-text-muted">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>

          {/* Cards list */}
          <div className="divide-y divide-surface-border border border-surface-border rounded-lg overflow-hidden">
            {tab === 'skills'
              ? skills.map((skill) => <SkillCard key={skill.name} skill={skill} />)
              : skillsets.map((ss) => <SkillsetCard key={ss.name} skillset={ss} />)
            }
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <a
                href={currentPage > 1
                  ? buildHref(searchParams, { offset: String((currentPage - 2) * limit) })
                  : undefined}
                aria-disabled={currentPage === 1}
                className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors ${
                  currentPage === 1
                    ? 'border-surface-border text-text-muted pointer-events-none opacity-40'
                    : 'border-surface-border text-text-secondary hover:text-text-primary bg-surface-raised'
                }`}
              >
                ← Previous
              </a>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((p, i) =>
                  p === '...' ? (
                    <span key={`ellipsis-${i}`} className="text-xs font-mono text-text-muted px-2">…</span>
                  ) : (
                    <a
                      key={p}
                      href={buildHref(searchParams, { offset: String((p - 1) * limit) })}
                      className={`text-xs font-mono w-8 h-8 flex items-center justify-center rounded-lg border transition-colors ${
                        p === currentPage
                          ? 'bg-surface-overlay text-text-primary border-brand/20'
                          : 'border-transparent text-text-muted hover:text-text-primary hover:border-surface-border'
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
                className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors ${
                  currentPage === totalPages
                    ? 'border-surface-border text-text-muted pointer-events-none opacity-40'
                    : 'border-surface-border text-text-secondary hover:text-text-primary bg-surface-raised'
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
