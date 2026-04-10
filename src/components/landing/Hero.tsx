import Link from 'next/link'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { TabSwitcher } from '@/components/ui/TabSwitcher'

const installTabs = [
  {
    id: 'npm',
    label: 'npm',
    content: <CodeBlock code="npm install -g skilldex-cli" language="bash" />,
  },
  {
    id: 'brew',
    label: 'Homebrew',
    content: <CodeBlock code={"brew tap pandemonium-research/skilldex\nbrew install skilldex-cli"} language="bash" />,
  },
  {
    id: 'curl',
    label: 'curl',
    content: <CodeBlock code="curl -fsSL https://skilldex-web.vercel.app/install.sh | sh" language="bash" />,
  },
  {
    id: 'scoop',
    label: 'Scoop',
    content: <CodeBlock code={"scoop bucket add skilldex https://github.com/Pandemonium-Research/scoop-skilldex\nscoop install skilldex-cli"} language="bash" />,
  },
]

export function Hero() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-sm text-text-muted mb-6 tracking-wide">
          skilldex / v1.0
        </p>

        <h1 className="text-4xl sm:text-5xl font-semibold text-text-primary leading-[1.15] tracking-tight mb-5">
          A package manager<br className="hidden sm:block" /> for Claude Code skills.
        </h1>

        <p className="text-lg text-text-secondary max-w-xl mb-10 leading-relaxed">
          Install, share, and discover skills from a central registry.
          One command. Any project.
        </p>

        {/* Install tabs */}
        <div className="w-full sm:w-[480px] mb-10">
          <TabSwitcher tabs={installTabs} defaultTab="npm" />
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/docs/getting-started"
            className="text-sm font-medium text-text-primary hover:text-brand transition-colors underline underline-offset-4 decoration-surface-border hover:decoration-brand"
          >
            Get started →
          </Link>
          <Link
            href="/registry"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Browse registry
          </Link>
        </div>

        <div className="flex items-center gap-6 text-xs text-text-muted font-mono mt-10">
          <span>Open source</span>
          <span className="text-surface-border">·</span>
          <span>MIT license</span>
          <span className="text-surface-border">·</span>
          <span>Spec v1.0</span>
        </div>
      </div>
    </section>
  )
}
