import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { CopyButton } from '@/components/ui/CopyButton'
import type { RegistrySkill } from '@/types/registry'

function ScoreLabel({ score }: { score: number | null }) {
  if (score === null) return <span className="text-xs font-mono text-text-muted">—</span>
  const color = score >= 80 ? 'text-term-green' : score >= 50 ? 'text-term-yellow' : 'text-term-red'
  return (
    <span className="text-xs font-mono text-text-muted">
      <span className={color}>{score}</span>/100
    </span>
  )
}

export function SkillCard({ skill }: { skill: RegistrySkill }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-4 bg-surface-raised hover:bg-surface-overlay transition-colors">
      <div className="flex items-center gap-3 sm:w-56 flex-none">
        <Link
          href={`/registry/${skill.name}`}
          className="text-sm font-mono font-medium text-text-primary hover:text-term-green transition-colors"
        >
          {skill.name}
        </Link>
        <Badge variant={skill.trust_tier === 'verified' ? 'verified' : 'community'}>
          {skill.trust_tier === 'verified' ? 'Verified' : 'Community'}
        </Badge>
      </div>

      <p className="text-sm text-text-secondary leading-relaxed flex-1 min-w-0 line-clamp-2">
        {skill.description}
      </p>

      <div className="flex items-center gap-4 flex-none">
        <ScoreLabel score={skill.score} />
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
