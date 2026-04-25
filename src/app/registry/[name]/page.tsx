import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { CopyButton } from '@/components/ui/CopyButton'
import { getSkill } from '@/lib/registry'

type Props = { params: { name: string } }

export async function generateMetadata({ params }: Props) {
  const skill = await getSkill(params.name)
  if (!skill) return { title: 'Skill not found — Skilldex' }
  return {
    title: `${skill.name} — Skilldex Registry`,
    description: skill.description,
  }
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-term-green' : score >= 50 ? 'bg-term-yellow' : 'bg-term-red'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-surface-base rounded-full h-1.5 overflow-hidden border border-surface-border">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-mono text-text-muted w-12 text-right">{score}/100</span>
    </div>
  )
}

export default async function SkillPage({ params }: Props) {
  const skill = await getSkill(params.name)
  if (!skill) notFound()

  const publishedDate = new Date(skill.published_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link
          href="/registry"
          className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors mb-4 inline-block"
        >
          ← Registry
        </Link>

        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-2xl font-mono font-semibold text-text-primary">
            {skill.name}
          </h1>
          <Badge variant={skill.trust_tier === 'verified' ? 'verified' : 'community'}>
            {skill.trust_tier === 'verified' ? 'Verified' : 'Community'}
          </Badge>
        </div>

        <p className="text-text-secondary leading-relaxed">{skill.description}</p>
      </div>

      {/* Install */}
      <div className="border border-surface-border rounded-lg p-4 mb-6 bg-surface-raised">
        <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-3">Install</p>
        <div className="flex items-center gap-2 bg-surface-base rounded border border-surface-border px-3 py-2.5">
          <code className="text-sm font-mono text-text-primary flex-1">
            skillpm install {skill.name}
          </code>
          <CopyButton text={`skillpm install ${skill.name}`} />
        </div>
      </div>

      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {skill.score !== null && (
          <div className="border border-surface-border rounded-lg p-4 bg-surface-raised col-span-2">
            <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-3">
              Format score
            </p>
            <ScoreBar score={skill.score} />
          </div>
        )}

        <div className="border border-surface-border rounded-lg p-4 bg-surface-raised">
          <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-1">Spec</p>
          <p className="text-sm font-mono text-text-primary">v{skill.spec_version}</p>
        </div>

        <div className="border border-surface-border rounded-lg p-4 bg-surface-raised">
          <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-1">Installs</p>
          <p className="text-sm font-mono text-text-primary">{skill.install_count.toLocaleString()}</p>
        </div>

        {skill.author && (
          <div className="border border-surface-border rounded-lg p-4 bg-surface-raised">
            <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-1">Author</p>
            <a
              href={`https://github.com/${skill.author}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono text-brand hover:underline"
            >
              @{skill.author}
            </a>
          </div>
        )}

        <div className="border border-surface-border rounded-lg p-4 bg-surface-raised">
          <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-1">Published</p>
          <p className="text-sm font-mono text-text-primary">{publishedDate}</p>
        </div>
      </div>

      {/* Tags */}
      {skill.tags.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-3">Tags</p>
          <div className="flex flex-wrap gap-2">
            {skill.tags.map((tag) => (
              <Link
                key={tag}
                href={`/registry?tier=&q=${encodeURIComponent(tag)}`}
                className="text-xs font-mono px-2.5 py-1 bg-surface-raised border border-surface-border rounded hover:border-brand transition-colors text-text-secondary"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Source */}
      <div className="border border-surface-border rounded-lg p-4 bg-surface-raised">
        <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-1">Source</p>
        <a
          href={skill.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-mono text-brand hover:underline break-all"
        >
          {skill.source_url}
        </a>
      </div>
    </main>
  )
}
