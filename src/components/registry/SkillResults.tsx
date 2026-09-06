'use client'

import { useState } from 'react'
import { SkillCard } from '@/components/registry/SkillCard'
import type { RegistrySkill, SearchOptions, SkillSearchResult } from '@/types/registry'
import { formatTotal } from '@/lib/format'

type Props = {
  initialSkills: RegistrySkill[]
  initialHasMore: boolean
  total: number
  totalRelation: 'eq' | 'gte'
  maxOffset: number
  pageSize: number
  query: SearchOptions
}

/**
 * Result list with a "Load more" button.
 *
 * ⚠ The parent MUST pass a `key` derived from the query. Without it, changing a filter
 * re-renders the server component with fresh `initialSkills`, but React preserves this
 * component's state because it sits at the same position in the tree — so rows accumulated
 * under the *previous* query stay on screen and the new first page is silently discarded,
 * since useState's initialiser only runs on mount. A `key` forces a remount. It looks
 * removable and is not.
 *
 * The accumulated offset is deliberately NOT written to the URL. The URL describes the query,
 * so a shared link restores the first page — which is what GitHub and npm do. Putting the
 * running offset in history would floods the back stack and, on reload, ask for more rows in
 * one request than the API's limit of 100 allows.
 */
export function SkillResults({
  initialSkills,
  initialHasMore,
  total,
  totalRelation,
  maxOffset,
  pageSize,
  query,
}: Props) {
  const [skills, setSkills] = useState(initialSkills)
  const [offset, setOffset] = useState(initialSkills.length)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // The API refuses offsets past the cap, because deep pages cannot be served at any speed.
  const capReached = offset >= maxOffset

  async function loadMore() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (query.q) params.set('q', query.q)
      if (query.tier) params.set('tier', query.tier)
      if (query.sort) params.set('sort', query.sort)
      if (query.tags) params.set('tags', query.tags)
      if (query.source) params.set('source', query.source)
      params.set('limit', String(pageSize))
      params.set('offset', String(offset))

      const res = await fetch(`/api/registry/skills?${params.toString()}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(
          body.code === 'OFFSET_TOO_LARGE'
            ? `Showing the first ${maxOffset.toLocaleString()} results — refine your search to see more.`
            : 'Could not load more results.'
        )
        setHasMore(false)
        return
      }

      const data: SkillSearchResult = await res.json()
      setSkills((prev) => [...prev, ...data.skills])
      setOffset((prev) => prev + data.skills.length)
      setHasMore(data.has_more)
    } catch {
      setError('Could not load more results.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-mono text-text-muted">
          {formatTotal(total, totalRelation)} skill{total !== 1 ? 's' : ''}
          {query.q ? ` for "${query.q}"` : ''}
        </p>
        <p className="text-xs font-mono text-text-muted">showing {skills.length}</p>
      </div>

      <div className="divide-y divide-surface-border border border-surface-border rounded-lg overflow-hidden">
        {skills.map((skill) => (
          <SkillCard key={skill.qualified_name} skill={skill} />
        ))}
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        {error && <p className="text-xs font-mono text-term-yellow">{error}</p>}

        {hasMore && !capReached && !error && (
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="text-xs font-mono px-5 py-2 rounded-lg border border-surface-border bg-surface-raised text-text-secondary hover:text-text-primary hover:border-brand/40 transition-colors disabled:opacity-50 disabled:cursor-default"
          >
            {loading ? 'Loading…' : 'Load more'}
          </button>
        )}

        {hasMore && capReached && !error && (
          <p className="text-xs font-mono text-text-muted">
            Showing the first {maxOffset.toLocaleString()} results — refine your search to see more.
          </p>
        )}

        {!hasMore && !error && skills.length > pageSize && (
          <p className="text-xs font-mono text-text-muted">End of results</p>
        )}
      </div>
    </>
  )
}
