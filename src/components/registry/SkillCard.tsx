import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { CopyButton } from '@/components/ui/CopyButton'
import type { RegistrySkill } from '@/types/registry'

/**
 * One row in a skill list.
 *
 * Imported by the client-side LoadMore component, so it is pulled into the client bundle.
 * That is fine — it has no server-only dependencies and already renders CopyButton, which is
 * a client component. It must stay free of `fs`, `next/headers` and direct data fetching.
 *
 * `variant="featured"` is the shorter form used by the curated strips on the landing page,
 * which have no room for the install command.
 */
export function SkillCard({
  skill,
  variant = 'list',
}: {
  skill: RegistrySkill
  variant?: 'list' | 'featured'
}) {
  const isVerified = skill.trust_tier === 'verified'
  // Names are unique only within an owner, so every link must be owner-qualified.
  const href = `/registry/${skill.owner}/${skill.name}`

  if (variant === 'featured') {
    return (
      <Link
        href={href}
        className="block px-4 py-3 hover:bg-surface-overlay transition-colors min-w-0"
      >
        <div className="flex items-center gap-2 mb-1 min-w-0">
          <span className="text-sm font-mono font-medium text-text-primary truncate">
            {skill.name}
          </span>
          {isVerified && <Badge variant="verified">verified</Badge>}
        </div>
        <p className="text-xs text-text-muted font-mono truncate mb-1">{skill.owner}</p>
        <p className="text-sm text-text-secondary leading-snug line-clamp-2">
          {skill.description}
        </p>
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-6 px-5 py-3.5 hover:bg-surface-overlay transition-colors group">
      {/* Name + owner + badge */}
      <div className="w-60 flex-none min-w-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <Link
            href={href}
            className="text-sm font-mono font-medium text-text-primary hover:text-brand transition-colors truncate"
          >
            {skill.name}
          </Link>
          {isVerified && <Badge variant="verified">verified</Badge>}
        </div>
        <p className="text-xs font-mono text-text-muted truncate">{skill.owner}</p>
      </div>

      {/* Description — takes all remaining space */}
      <p className="text-sm text-text-secondary leading-relaxed flex-1 min-w-0 line-clamp-1">
        {skill.description}
      </p>

      {/* Score */}
      {skill.score !== null && (
        <span className="text-xs font-mono text-text-secondary flex-none">{skill.score}</span>
      )}

      {/* Install command. Bare name deliberately — see the note on the detail page. */}
      <div className="hidden lg:flex items-center gap-2 bg-surface-overlay border border-surface-border rounded px-3 py-1.5 flex-none">
        <code className="text-xs font-mono text-text-primary whitespace-nowrap">
          skillpm install {skill.name}
        </code>
        <CopyButton text={`skillpm install ${skill.name}`} />
      </div>
    </div>
  )
}
