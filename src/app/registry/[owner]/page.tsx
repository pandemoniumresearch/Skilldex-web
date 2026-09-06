import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { SkillCard } from '@/components/registry/SkillCard'
import { resolveBareName, searchSkills } from '@/lib/registry'

/**
 * Dual-purpose route: a legacy bare skill name, or an owner.
 *
 * The segment is named `[owner]` because Next.js will not allow two differently-named dynamic
 * slugs at the same position — `[name]` here and `[owner]` in the nested route is a build
 * error, not a precedence question. `[owner]` is right for the nested route and for the
 * majority case, so it wins.
 *
 * Resolution order:
 *   1. a skill with this bare name, unique across owners  → redirect to the canonical URL
 *   2. a skill name claimed by several owners             → disambiguation list
 *   3. otherwise                                          → treat it as an owner profile
 */
type Props = { params: { owner: string } }

export async function generateMetadata({ params }: Props) {
  return {
    title: `${params.owner} — Skilldex Registry`,
    // Neither a disambiguation list nor an owner index is content worth indexing; the
    // canonical skill pages are.
    robots: { index: false },
  }
}

export default async function OwnerOrBareNamePage({ params }: Props) {
  const resolved = await resolveBareName(params.owner)

  if (resolved.status === 'error') {
    // Let error.tsx render. Falling through to notFound() here is what made an outage look
    // like a missing skill.
    throw new Error(`Registry lookup failed for "${params.owner}"`)
  }

  if (resolved.status === 'ok') {
    // 307, NOT permanentRedirect. Whether a bare name resolves uniquely is data-dependent and
    // reversible — it stops being unique the moment a second owner claims it. A browser-cached
    // 308 would then be permanently wrong with no way to recall it.
    redirect(`/registry/${resolved.skill.owner}/${resolved.skill.name}`)
  }

  if (resolved.status === 'ambiguous') {
    const { skills } = await searchSkills({ q: params.owner, scope: 'all', limit: 20 })
    const matches = skills.filter((s) => s.name === params.owner)

    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/registry"
          className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors mb-4 inline-block"
        >
          ← Registry
        </Link>
        <h1 className="text-2xl font-mono font-semibold text-text-primary mb-2">
          Several skills are named{' '}
          <span className="text-brand">{params.owner}</span>
        </h1>
        <p className="text-sm text-text-secondary mb-6">
          Skill names are unique within an owner, not across the registry. Pick the one you want.
        </p>

        {matches.length > 0 ? (
          <div className="divide-y divide-surface-border border border-surface-border rounded-lg overflow-hidden">
            {matches.map((s) => (
              <SkillCard key={s.qualified_name} skill={s} />
            ))}
          </div>
        ) : (
          <ul className="border border-surface-border rounded-lg divide-y divide-surface-border overflow-hidden">
            {resolved.owners.map((o) => (
              <li key={o}>
                <Link
                  href={`/registry/${o}/${params.owner}`}
                  className="block px-4 py-3 font-mono text-sm text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors"
                >
                  {o}/{params.owner}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  // Not a skill name — try it as an owner.
  const { skills, total, total_relation } = await searchSkills({
    owner: params.owner,
    scope: 'all',
    limit: 50,
    sort: 'score',
  })

  if (skills.length === 0) notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/registry"
        className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors mb-4 inline-block"
      >
        ← Registry
      </Link>
      <h1 className="text-2xl font-mono font-semibold text-text-primary mb-1">{params.owner}</h1>
      <p className="text-sm text-text-secondary mb-6">
        {total_relation === 'gte' ? `${total.toLocaleString()}+` : total.toLocaleString()} skill
        {total !== 1 ? 's' : ''} in the registry
      </p>

      <div className="divide-y divide-surface-border border border-surface-border rounded-lg overflow-hidden">
        {skills.map((s) => (
          <SkillCard key={s.qualified_name} skill={s} />
        ))}
      </div>
    </div>
  )
}
