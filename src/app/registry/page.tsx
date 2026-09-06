import Link from 'next/link'
import { SearchBar } from '@/components/registry/SearchBar'
import { SkillResults } from '@/components/registry/SkillResults'
import { SkillsetCard } from '@/components/registry/SkillsetCard'
import { CategorySection } from '@/components/registry/CategorySection'
import { getStats, getTags, searchSkills, searchSkillsets } from '@/lib/registry'
import { formatTotal } from '@/lib/format'
import type { SearchOptions } from '@/types/registry'

type Props = {
  searchParams: {
    q?: string
    tier?: string
    sort?: string
    tags?: string
    limit?: string
    tab?: string
  }
}

export const metadata = {
  title: 'Registry — Skilldex',
  description: 'Browse and search Claude skill packages',
}

const PAGE_SIZE = 24
const FEATURED = 6

function buildHref(searchParams: Props['searchParams'], updates: Partial<Props['searchParams']>) {
  const merged = { ...searchParams, ...updates }
  const params = new URLSearchParams()
  if (merged.tab && merged.tab !== 'skills') params.set('tab', merged.tab)
  if (merged.q) params.set('q', merged.q)
  if (merged.tier) params.set('tier', merged.tier)
  if (merged.tags) params.set('tags', merged.tags)
  // Absence of `sort` is the only representation of "default". The API resolves it
  // conditionally — relevance when `q` is present, installs otherwise — so 'installs' is no
  // longer *the* default and must survive in the URL when explicitly chosen.
  if (merged.sort) params.set('sort', merged.sort)
  if (merged.limit && merged.limit !== String(PAGE_SIZE)) params.set('limit', merged.limit)
  return `/registry${params.size ? `?${params.toString()}` : ''}`
}

export default async function RegistryPage({ searchParams }: Props) {
  const tab = searchParams.tab === 'skillsets' ? 'skillsets' : 'skills'
  const limit = Math.min(Math.max(Number(searchParams.limit) || PAGE_SIZE, 1), 100)

  // Anything that narrows the registry puts the page into results mode. With none of it there
  // is nothing meaningful to list — at corpus scale every ordering column is degenerate, so
  // "the first 24 skills" would be arbitrary rows out of 1.6M — so the landing state shows
  // category strips instead.
  const hasQuery = Boolean(
    searchParams.q || searchParams.tier || searchParams.tags || searchParams.sort
  )

  const stats = await getStats()

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-2">
          skilldex / registry
        </p>
        <h1 className="text-2xl font-mono font-semibold text-text-primary mb-1">Registry</h1>
        {stats ? (
          <p className="text-sm text-text-secondary font-mono">
            <span className="text-text-primary">{stats.skills.total.toLocaleString()}</span>{' '}
            skills
            {stats.owners > 0 && (
              <>
                {' from '}
                <span className="text-text-primary">{stats.owners.toLocaleString()}</span> owners
              </>
            )}
          </p>
        ) : (
          <p className="text-sm text-text-secondary">
            Discover and install Claude Code skills from the community
          </p>
        )}
      </div>

      {/* Pill tab switcher */}
      <div className="inline-flex items-center gap-1 bg-surface-raised border border-surface-border rounded-lg p-1 mb-6">
        {(['skills', 'skillsets'] as const).map((t) => (
          <a
            key={t}
            href={buildHref({ ...searchParams, tab: t }, {})}
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

      <div className="mb-6">
        <SearchBar
          defaultQ={searchParams.q}
          defaultTier={searchParams.tier}
          defaultSort={searchParams.sort}
          defaultLimit={limit}
          defaultTab={tab}
        />
      </div>

      {tab === 'skillsets' ? (
        <SkillsetsTab searchParams={searchParams} limit={limit} />
      ) : hasQuery ? (
        <SkillsResults searchParams={searchParams} limit={limit} />
      ) : (
        <LandingSections searchParams={searchParams} />
      )}
    </div>
  )
}

/* --------------------------------------------------------------------------- */

/**
 * Landing state: category strips over the whole registry.
 *
 * Deliberately NOT scoped by provenance. Search spans everything, and so do these — a skill
 * being verified or installed is what makes it interesting, not which repo happened to be on
 * the watch list. They work unscoped because the signal sorts to the top on its own: the rows
 * with installs, tags or a verified tier float up regardless of how many zero-signal rows sit
 * behind them.
 *
 * "Recently added" is the one that degrades right after a corpus import, since the whole batch
 * shares an import timestamp. It self-heals as the seeder adds genuinely newer rows.
 */
async function LandingSections({ searchParams }: { searchParams: Props['searchParams'] }) {
  const [verified, installed, recent, tags] = await Promise.all([
    searchSkills({ tier: 'verified', limit: FEATURED }),
    searchSkills({ sort: 'installs', limit: FEATURED }),
    searchSkills({ sort: 'recent', limit: FEATURED }),
    getTags(),
  ])

  const topTags = tags.slice(0, 16)

  return (
    <>
      <CategorySection
        title="Official"
        blurb="Published by Anthropic"
        href={buildHref(searchParams, { tier: 'verified' })}
        skills={verified.skills}
      />

      <CategorySection
        title="Most installed"
        blurb="What people actually use"
        href={buildHref(searchParams, { sort: 'installs' })}
        skills={installed.skills}
      />

      <CategorySection
        title="Recently added"
        blurb="Newest in the registry"
        href={buildHref(searchParams, { sort: 'recent' })}
        skills={recent.skills}
      />

      {topTags.length > 0 && (
        <section className="mb-10">
          <h2 className="text-sm font-mono font-semibold text-text-primary mb-1">Browse by tag</h2>
          <p className="text-xs text-text-muted mb-3">Jump straight to a topic</p>
          <div className="flex flex-wrap gap-2">
            {topTags.map(({ tag, skill_count }) => (
              <Link
                key={tag}
                href={buildHref(searchParams, { tags: tag })}
                className="text-xs font-mono px-2.5 py-1 bg-surface-raised border border-surface-border rounded hover:border-brand transition-colors text-text-secondary"
              >
                {tag}
                <span className="text-text-muted ml-1.5">{skill_count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

/* --------------------------------------------------------------------------- */

async function SkillsResults({
  searchParams,
  limit,
}: {
  searchParams: Props['searchParams']
  limit: number
}) {
  const query: SearchOptions = {
    q: searchParams.q,
    tier: searchParams.tier,
    tags: searchParams.tags,
    // Send `sort` only when the user chose one. Defaulting to 'installs' here overrode the
    // API's resolveSort() and made every text search rank by install_count — which is 0 for
    // all but 33 rows — so bm25 relevance ordering was unreachable from the site.
    sort: searchParams.sort,
    limit,
    offset: 0,
  }

  const result = await searchSkills(query)

  if (result.skills.length === 0) {
    return (
      <EmptyState
        noun="skill"
        searched={Boolean(searchParams.q || searchParams.tier || searchParams.tags)}
      />
    )
  }

  return (
    <>
      <SkillResults
        // Load-bearing. See the note in SkillResults — without it, rows accumulated under the
        // previous query survive a filter change and the new first page is discarded.
        key={JSON.stringify({
          q: searchParams.q,
          tier: searchParams.tier,
          tags: searchParams.tags,
          sort: searchParams.sort,
          limit,
        })}
        initialSkills={result.skills}
        initialHasMore={result.has_more}
        total={result.total}
        totalRelation={result.total_relation}
        maxOffset={result.max_offset}
        pageSize={limit}
        query={query}
      />
    </>
  )
}

/* --------------------------------------------------------------------------- */

async function SkillsetsTab({
  searchParams,
  limit,
}: {
  searchParams: Props['searchParams']
  limit: number
}) {
  const { skillsets, total, total_relation } = await searchSkillsets({
    q: searchParams.q,
    tier: searchParams.tier,
    sort: searchParams.sort,
    limit,
  })

  if (skillsets.length === 0) {
    return <EmptyState noun="skillset" searched={Boolean(searchParams.q || searchParams.tier)} />
  }

  return (
    <>
      <p className="text-xs font-mono text-text-muted mb-3">
        {formatTotal(total, total_relation)} skillset{total !== 1 ? 's' : ''}
      </p>
      <div className="divide-y divide-surface-border border border-surface-border rounded-lg overflow-hidden">
        {skillsets.map((ss) => (
          <SkillsetCard key={ss.name} skillset={ss} />
        ))}
      </div>
    </>
  )
}

function EmptyState({ noun, searched }: { noun: string; searched: boolean }) {
  const publishCmd = noun === 'skillset' ? 'skillpm skillset publish' : 'skillpm publish'

  return (
    <div className="border border-surface-border rounded-lg px-6 py-16 text-center bg-surface-raised/50">
      <div className="w-12 h-12 rounded-full bg-surface-overlay border border-surface-border flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-5 h-5 text-text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <p className="text-sm font-mono text-text-secondary mb-2">
        {searched ? `No ${noun}s match your search.` : `No ${noun}s published yet.`}
      </p>

      <p className="text-xs text-text-muted font-mono">
        Be the first — run{' '}
        <code className="text-text-secondary bg-surface-overlay px-1.5 py-0.5 rounded">
          {publishCmd}
        </code>{' '}
        from your {noun} folder.
      </p>
    </div>
  )
}
