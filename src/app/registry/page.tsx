import { SearchBar } from '@/components/registry/SearchBar'
import { SkillCard } from '@/components/registry/SkillCard'
import { searchSkills } from '@/lib/registry'

type Props = {
  searchParams: { q?: string; tier?: string; sort?: string; offset?: string }
}

export const metadata = {
  title: 'Registry — Skilldex',
  description: 'Browse and search Claude skill packages',
}

export default async function RegistryPage({ searchParams }: Props) {
  const offset = Number(searchParams.offset) || 0
  const limit = 20

  const { skills, total } = await searchSkills({
    q: searchParams.q,
    tier: searchParams.tier,
    sort: searchParams.sort || 'installs',
    limit,
    offset,
  })

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-2">
          Registry
        </p>
        <h1 className="text-2xl font-mono font-semibold text-text-primary">
          Browse skills
        </h1>
      </div>

      <div className="mb-6">
        <SearchBar
          defaultQ={searchParams.q}
          defaultTier={searchParams.tier}
          defaultSort={searchParams.sort}
        />
      </div>

      {skills.length === 0 ? (
        <div className="border border-surface-border rounded-lg px-6 py-12 text-center">
          <p className="text-sm font-mono text-text-secondary mb-2">
            {searchParams.q || searchParams.tier
              ? 'No skills match your search.'
              : 'No skills published yet.'}
          </p>
          <p className="text-xs text-text-muted font-mono">
            Be the first — run <code className="text-term-green">skillpm publish</code> from your skill folder.
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs font-mono text-text-muted mb-3">
            {total} skill{total !== 1 ? 's' : ''}
            {searchParams.q ? ` for "${searchParams.q}"` : ''}
          </p>

          <div className="divide-y divide-surface-border border border-surface-border rounded-lg overflow-hidden">
            {skills.map((skill) => (
              <SkillCard key={skill.name} skill={skill} />
            ))}
          </div>

          {total > limit && (
            <div className="flex justify-between mt-6">
              {offset > 0 ? (
                <a
                  href={`/registry?${new URLSearchParams({ ...searchParams, offset: String(offset - limit) })}`}
                  className="text-xs font-mono text-text-secondary hover:text-text-primary transition-colors"
                >
                  ← Previous
                </a>
              ) : <span />}
              {offset + limit < total && (
                <a
                  href={`/registry?${new URLSearchParams({ ...searchParams, offset: String(offset + limit) })}`}
                  className="text-xs font-mono text-text-secondary hover:text-text-primary transition-colors"
                >
                  Next →
                </a>
              )}
            </div>
          )}
        </>
      )}
    </main>
  )
}
