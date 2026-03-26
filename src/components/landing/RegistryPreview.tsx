import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { CopyButton } from '@/components/ui/CopyButton'
import { searchSkills } from '@/lib/registry'
import type { RegistrySkill } from '@/types/registry'

function SkillRow({ skill }: { skill: RegistrySkill }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-4 bg-surface-raised hover:bg-surface-overlay transition-colors">
      <div className="flex items-center gap-3 sm:w-48 flex-none">
        <code className="text-sm font-mono font-medium text-text-primary">
          {skill.name}
        </code>
        <Badge variant={skill.trust_tier === 'verified' ? 'verified' : 'community'}>
          {skill.trust_tier === 'verified' ? 'Verified' : 'Community'}
        </Badge>
      </div>

      <p className="text-sm text-text-secondary leading-relaxed flex-1 min-w-0">
        {skill.description}
      </p>

      <div className="flex items-center gap-4 flex-none">
        {skill.score !== null && (
          <span className="text-xs font-mono text-text-muted">
            <span className="text-term-green">{skill.score}</span>/100
          </span>
        )}
        <div className="flex items-center gap-1 bg-surface-base rounded border border-surface-border px-2.5 py-1.5">
          <code className="text-xs font-mono text-text-muted whitespace-nowrap">
            skillpm install {skill.name}
          </code>
          <CopyButton text={`skillpm install ${skill.name}`} />
        </div>
      </div>
    </div>
  )
}

export async function RegistryPreview() {
  const { skills } = await searchSkills({ sort: 'installs', limit: 3 })

  if (skills.length === 0) return null

  return (
    <section className="py-16 border-t border-surface-border">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between mb-6">
          <p className="text-xs font-mono text-text-muted uppercase tracking-widest">
            Registry
          </p>
          <Link
            href="/registry"
            className="text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            Browse all →
          </Link>
        </div>

        <div className="divide-y divide-surface-border border border-surface-border rounded-lg overflow-hidden">
          {skills.map((skill) => (
            <SkillRow key={skill.name} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  )
}
