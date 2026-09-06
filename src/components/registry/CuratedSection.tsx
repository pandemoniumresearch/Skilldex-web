import Link from 'next/link'
import { SkillCard } from '@/components/registry/SkillCard'
import type { RegistrySkill } from '@/types/registry'

/**
 * One curated strip on the registry landing page.
 *
 * Every strip is a fixed query with no user input, so each one is a stable URL that hits both
 * Next's Data Cache and the registry's CDN cache. That is the point: the landing page costs
 * essentially nothing to render no matter how large the corpus grows.
 */
export function CuratedSection({
  title,
  blurb,
  href,
  skills,
}: {
  title: string
  blurb: string
  href: string
  skills: RegistrySkill[]
}) {
  if (skills.length === 0) return null

  return (
    <section className="mb-10">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <h2 className="text-sm font-mono font-semibold text-text-primary">{title}</h2>
          <p className="text-xs text-text-muted mt-0.5">{blurb}</p>
        </div>
        <Link
          href={href}
          className="text-xs font-mono text-text-muted hover:text-brand transition-colors flex-none ml-4"
        >
          view all →
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-surface-border border border-surface-border rounded-lg overflow-hidden">
        {skills.map((skill) => (
          <div key={skill.qualified_name} className="bg-surface-raised">
            <SkillCard skill={skill} variant="featured" />
          </div>
        ))}
      </div>
    </section>
  )
}
