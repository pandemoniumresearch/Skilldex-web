import type { Metadata } from 'next'
import { Hero } from '@/components/landing/Hero'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { TerminalDemo } from '@/components/landing/TerminalDemo'
import { RegistryPreview } from '@/components/landing/RegistryPreview'


export const metadata: Metadata = {
  title: 'Skilldex — The skill package manager for AI agents',
  description:
    'Install, share, and discover Claude Code skills. One command gets you any skill from the registry.',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <TerminalDemo />
      <RegistryPreview />

    </>
  )
}
