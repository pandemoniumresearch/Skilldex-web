'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useRef } from 'react'

const PER_PAGE_OPTIONS = [20, 50, 100]

type Props = {
  defaultQ?: string
  defaultTier?: string
  defaultSort?: string
  defaultLimit?: number
  defaultTab?: string
}

export function SearchBar({ defaultQ, defaultTier, defaultSort, defaultLimit, defaultTab }: Props) {
  const router = useRouter()
  // Not a hardcoded '/registry': this component also renders on /registry/skillsets, where
  // pushing to '/registry' navigated the user away from the page they were searching.
  const pathname = usePathname()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function pushParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams()
    const merged = {
      tab: defaultTab,
      q: defaultQ,
      tier: defaultTier,
      sort: defaultSort,
      limit: defaultLimit ? String(defaultLimit) : undefined,
      ...updates,
    }
    if (merged.tab && merged.tab !== 'skills') params.set('tab', merged.tab)
    if (merged.q) params.set('q', merged.q)
    if (merged.tier) params.set('tier', merged.tier)
    // See buildHref in app/registry/page.tsx — absence is the only "default" for sort.
    if (merged.sort) params.set('sort', merged.sort)
    if (merged.limit && merged.limit !== '20') params.set('limit', merged.limit)
    router.push(`${pathname}${params.size ? `?${params.toString()}` : ''}`)
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      pushParams({ q: e.target.value.trim() || undefined })
    }, 300)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {/* Search input with icon */}
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
        </svg>
        <input
          type="text"
          defaultValue={defaultQ}
          onChange={handleSearch}
          placeholder={defaultTab === 'skillsets' ? 'Search skillsets…' : 'Search skills…'}
          className="w-full bg-surface-raised border border-surface-border rounded-lg pl-9 pr-4 py-2.5 text-sm font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/20 transition-all"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <select
          defaultValue={defaultTier ?? ''}
          onChange={(e) => pushParams({ tier: e.target.value || undefined })}
          className="bg-surface-raised border border-surface-border rounded-lg px-3 py-2.5 text-sm font-mono text-text-secondary focus:outline-none focus:border-brand/60 transition-colors cursor-pointer"
        >
          <option value="">All tiers</option>
          <option value="verified">Verified</option>
          <option value="community">Community</option>
        </select>

        <select
          // `key` forces a remount when the URL changes, so browser-back updates the control.
          // Uncontrolled selects keep their DOM value otherwise.
          key={`sort-${defaultSort ?? ''}-${defaultQ ?? ''}`}
          // Mirror the API's conditional default so the control shows what will actually
          // happen. Shown unconditionally: resolveSort() falls back to installs when
          // relevance is requested without a query, so there is no broken state.
          defaultValue={defaultSort ?? (defaultQ ? 'relevance' : 'installs')}
          onChange={(e) => pushParams({ sort: e.target.value })}
          className="bg-surface-raised border border-surface-border rounded-lg px-3 py-2.5 text-sm font-mono text-text-secondary focus:outline-none focus:border-brand/60 transition-colors cursor-pointer"
        >
          <option value="relevance">Best match</option>
          <option value="installs">Most installed</option>
          <option value="score">Highest score</option>
          <option value="recent">Recently added</option>
          <option value="name">Alphabetical</option>
        </select>

        <select
          defaultValue={defaultLimit ?? 20}
          onChange={(e) => pushParams({ limit: e.target.value })}
          className="bg-surface-raised border border-surface-border rounded-lg px-3 py-2.5 text-sm font-mono text-text-secondary focus:outline-none focus:border-brand/60 transition-colors cursor-pointer"
        >
          {PER_PAGE_OPTIONS.map((n) => (
            <option key={n} value={n}>{n} / page</option>
          ))}
        </select>
      </div>
    </div>
  )
}
