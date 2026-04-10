const lines = [
  { type: 'prompt',  text: '$ skillpm install forensics-agent' },
  { type: 'dim',     text: 'Resolving forensics-agent@latest...' },
  { type: 'dim',     text: 'Fetching from registry...' },
  { type: 'success', text: '✓ forensics-agent@1.2.0  score: 94/100  Verified' },
  { type: 'dim',     text: 'Installing to global scope...' },
  { type: 'success', text: '✓ Done  1 skill  3 resources' },
  { type: 'blank',   text: '' },
  { type: 'prompt',  text: '$ skillpm list' },
  { type: 'out',     text: 'Global (1)' },
  { type: 'out',     text: '  forensics-agent  1.2.0  score: 94' },
  { type: 'blank',   text: '' },
  { type: 'comment', text: '# Claude Code now has access to /forensics-analyze' },
]

// Monochrome terminal palette: white for prompts, light gray for output,
// mid gray for dim/comments — only one blue accent for the cursor
const cx: Record<string, string> = {
  prompt:  'text-text-primary',
  dim:     'text-text-muted',
  success: 'text-text-secondary',
  out:     'text-text-secondary',
  blank:   '',
  comment: 'text-text-muted',
}

export function TerminalDemo() {
  return (
    <section className="py-16 border-t border-surface-border">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-surface-border overflow-hidden">
          {/* Window chrome — plain dots, no traffic-light colors */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-surface-raised border-b border-surface-border">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" aria-hidden="true" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" aria-hidden="true" />
          </div>
          <div className="p-5 font-mono text-sm leading-6 bg-[#0d1117]">
            {lines.map((line, i) => (
              <div key={i} className={cx[line.type] ?? ''}>
                {line.text || '\u00A0'}
              </div>
            ))}
            <span className="text-text-secondary">$ </span>
            <span className="inline-block w-1.5 h-4 bg-brand/70 align-middle" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}
