import Link from 'next/link'
import { CopyButton } from '@/components/ui/CopyButton'
import { searchSkills } from '@/lib/registry'
import type { RegistrySkill } from '@/types/registry'

function SkillRow({ skill }: { skill: RegistrySkill }) {
  const isVerified = skill.trust_tier === 'verified'
  return (
    <div className="flex items-center gap-6 px-5 py-4 hover:bg-surface-overlay transition-colors">
      {/* Icon badge */}
      <div className={`w-9 h-9 rounded-lg flex-none flex items-center justify-center font-mono text-sm font-bold ${
        isVerified
          ? 'bg-gradient-to-br from-brand to-brand-dim text-[#1a0e02] shadow-[0_0_12px_rgba(255,138,31,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]'
          : 'bg-surface-overlay text-text-secondary'
      }`}>
        {skill.name[0].toUpperCase()}
      </div>

      <div className="flex items-center gap-2.5 w-56 flex-none min-w-0">
        <code className="text-sm font-mono font-medium text-text-primary truncate">
          {skill.name}
        </code>
        {isVerified && (
          <span className="inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded border border-brand/30 text-brand bg-brand/[0.06] flex-none">
            verified
          </span>
        )}
      </div>
      <p className="text-sm text-text-secondary flex-1 min-w-0 line-clamp-1">
        {skill.description}
      </p>
      {skill.score !== null && (
        <span className="text-xs font-mono text-text-primary flex-none">{skill.score}</span>
      )}
      <div className="flex items-center gap-2 bg-surface-overlay border border-surface-border rounded-lg px-3 py-1.5 flex-none">
        <code className="text-xs font-mono text-text-primary whitespace-nowrap">
          skillpm i {skill.name}
        </code>
        <CopyButton text={`skillpm install ${skill.name}`} />
      </div>
    </div>
  )
}

export async function RegistryPreview() {
  const { skills } = await searchSkills({ sort: 'installs', limit: 3 })
  if (skills.length === 0) return null

  return (
    <section className="py-16 border-t border-surface-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-mono text-brand uppercase tracking-[0.14em] mb-1 font-semibold">Registry</p>
            <h2 className="text-2xl font-semibold">Popular this week</h2>
          </div>
          <Link href="/registry" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            Browse all →
          </Link>
        </div>
        <div className="divide-y divide-surface-border border border-surface-border rounded-xl overflow-hidden bg-surface-raised shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
          {skills.map((skill) => <SkillRow key={skill.qualified_name} skill={skill} />)}
        </div>
      </div>
    </section>
  )
}
