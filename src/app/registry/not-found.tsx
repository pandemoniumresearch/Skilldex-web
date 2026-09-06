import Link from 'next/link'

export default function RegistryNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 text-center">
      <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-3">404</p>
      <h1 className="text-lg font-mono font-semibold text-text-primary mb-2">
        No such skill
      </h1>
      <p className="text-sm text-text-secondary mb-6">
        Skills are addressed as <code className="font-mono text-text-primary">owner/name</code>.
        If you only know the name, search for it — several owners may publish the same one.
      </p>
      <Link
        href="/registry"
        className="text-xs font-mono px-4 py-2 rounded-lg border border-surface-border bg-surface-raised text-text-secondary hover:text-text-primary hover:border-brand/40 transition-colors"
      >
        Browse the registry
      </Link>
    </div>
  )
}
