'use client'

import Link from 'next/link'

/**
 * Registry error boundary.
 *
 * Before this existed, lib/registry.ts swallowed every failure into an empty result, so a
 * registry outage rendered as "No skills published yet. Be the first!" — telling users the
 * registry was empty when it was actually unreachable. The data layer now distinguishes the
 * two and throws; this is what catches it.
 */
export default function RegistryError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="w-12 h-12 rounded-full bg-surface-overlay border border-surface-border flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-5 h-5 text-term-yellow"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>

      <h1 className="text-lg font-mono font-semibold text-text-primary mb-2">
        The registry is unreachable
      </h1>
      <p className="text-sm text-text-secondary mb-6">
        This is a problem on our side, not with your search. Try again in a moment.
      </p>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="text-xs font-mono px-4 py-2 rounded-lg border border-surface-border bg-surface-raised text-text-secondary hover:text-text-primary hover:border-brand/40 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/registry"
          className="text-xs font-mono px-4 py-2 rounded-lg border border-transparent text-text-muted hover:text-text-primary transition-colors"
        >
          Back to registry
        </Link>
      </div>

      {error.digest && (
        <p className="text-xs font-mono text-text-muted mt-6">ref: {error.digest}</p>
      )}
    </div>
  )
}
