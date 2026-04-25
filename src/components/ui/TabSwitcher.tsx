'use client'

import { useState } from 'react'
import { clsx } from 'clsx'

type Tab = {
  id: string
  label: string
  content: React.ReactNode
}

type TabSwitcherProps = {
  tabs: Tab[]
  defaultTab?: string
}

export function TabSwitcher({ tabs, defaultTab }: TabSwitcherProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id)
  const active = tabs.find((t) => t.id === activeTab) ?? tabs[0]

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'px-3 py-1 text-xs font-mono rounded transition-colors',
              tab.id === activeTab
                ? 'bg-surface-overlay text-text-primary border border-brand/20'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{active?.content}</div>
    </div>
  )
}
