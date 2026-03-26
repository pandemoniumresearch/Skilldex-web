import type { RegistrySkill, SearchOptions } from '@/types/registry'

const REGISTRY_URL =
  process.env.REGISTRY_URL ?? 'https://skilldex-registry.vercel.app/v1'

export async function searchSkills(
  options: SearchOptions = {}
): Promise<{ skills: RegistrySkill[]; total: number }> {
  const params = new URLSearchParams()
  if (options.q) params.set('q', options.q)
  if (options.tier) params.set('tier', options.tier)
  if (options.sort) params.set('sort', options.sort)
  if (options.limit !== undefined) params.set('limit', String(options.limit))
  if (options.offset !== undefined) params.set('offset', String(options.offset))

  const qs = params.toString()
  try {
    const res = await fetch(`${REGISTRY_URL}/skills${qs ? `?${qs}` : ''}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return { skills: [], total: 0 }
    return res.json()
  } catch {
    return { skills: [], total: 0 }
  }
}

export async function getSkill(name: string): Promise<RegistrySkill | null> {
  try {
    const res = await fetch(
      `${REGISTRY_URL}/skills/${encodeURIComponent(name)}`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}
