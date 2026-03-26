import { TabSwitcher } from '@/components/ui/TabSwitcher'
import { CodeBlock } from '@/components/ui/CodeBlock'
import Link from 'next/link'

function TabContent({
  prereq,
  installCmd,
  language = 'bash',
}: {
  prereq: React.ReactNode
  installCmd: string
  language?: string
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">
          Prerequisites
        </h3>
        <div className="text-sm text-text-secondary">{prereq}</div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">
          Install
        </h3>
        <CodeBlock code={installCmd} language={language} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">
          Verify
        </h3>
        <CodeBlock code="skillpm --version" language="bash" />
        <p className="text-xs text-text-muted mt-2">
          You should see the installed version number printed to stdout.
        </p>
      </div>

      <div className="pt-2 border-t border-surface-border">
        <Link
          href="/docs/getting-started"
          className="text-sm text-brand hover:text-brand-dim transition-colors"
        >
          Continue to Getting Started →
        </Link>
      </div>
    </div>
  )
}

const tabs = [
  {
    id: 'npm',
    label: 'npm',
    content: (
      <TabContent
        prereq={<p>Node.js 18 or later. Check with <code className="font-mono text-term-cyan">node --version</code>.</p>}
        installCmd="npm install -g skillpm"
      />
    ),
  },
  {
    id: 'brew',
    label: 'Homebrew',
    content: (
      <TabContent
        prereq={<p>Homebrew installed on macOS or Linux. Install at <a href="https://brew.sh" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">brew.sh</a>.</p>}
        installCmd="brew install skilldex"
      />
    ),
  },
  {
    id: 'curl',
    label: 'curl',
    content: (
      <TabContent
        prereq={<p>macOS or Linux. The install script detects your OS and architecture and downloads the right binary automatically.</p>}
        installCmd="curl -fsSL https://skilldex.dev/install.sh | sh"
      />
    ),
  },
  {
    id: 'winget',
    label: 'winget',
    content: (
      <TabContent
        prereq={<p>Windows 10 (build 1709+) or Windows 11. winget is included by default.</p>}
        installCmd="winget install skilldex"
      />
    ),
  },
  {
    id: 'scoop',
    label: 'Scoop',
    content: (
      <TabContent
        prereq={<p>Scoop installed on Windows. Install at <a href="https://scoop.sh" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">scoop.sh</a>.</p>}
        installCmd="scoop install skilldex"
      />
    ),
  },
]

export function InstallTabs() {
  return <TabSwitcher tabs={tabs} defaultTab="npm" />
}
