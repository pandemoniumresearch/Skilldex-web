import type { Metadata } from 'next'
import { InstallTabs } from '@/components/install/InstallTabs'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Install',
  description: 'Install the Skilldex CLI on macOS, Linux, or Windows using npm, Homebrew, curl, winget, or Scoop.',
}

export default function InstallPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
          Install Skilldex
        </h1>
        <p className="text-text-secondary text-lg">
          Choose your platform and get the{' '}
          <code className="font-mono text-sm text-term-cyan bg-surface-overlay px-1.5 py-0.5 rounded">
            skillpm
          </code>{' '}
          CLI installed in under 60 seconds.
        </p>
      </div>

      <InstallTabs />
    </div>
  )
}
