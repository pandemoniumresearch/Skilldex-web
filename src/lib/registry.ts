import type {
  BareNameResolution,
  RegistrySkill,
  RegistrySkillset,
  RegistryStats,
  SearchOptions,
  SkillSearchResult,
  SkillsetSearchResult,
  TagCount,
} from '@/types/registry'

const REGISTRY_URL =
  process.env.REGISTRY_URL ?? 'https://skilldex-registry.vercel.app/v1'

/** Server-only. Never promote to NEXT_PUBLIC_ — the browser reaches the registry via the
 *  route handler at /api/registry/skills, which keeps this URL and Next's Data Cache in play. */
export { REGISTRY_URL }

const EMPTY_LIST = {
  total: 0,
  total_relation: 'eq' as const,
  has_more: false,
  limit: 20,
  offset: 0,
  max_offset: 10_000,
}

function buildQuery(options: SearchOptions): string {
  const params = new URLSearchParams()
  if (options.q) params.set('q', options.q)
  if (options.tier) params.set('tier', options.tier)
  if (options.sort) params.set('sort', options.sort)
  if (options.tags) params.set('tags', options.tags)
  if (options.owner) params.set('owner', options.owner)
  if (options.source) params.set('source', options.source)
  if (options.limit !== undefined) params.set('limit', String(options.limit))
  if (options.offset !== undefined) params.set('offset', String(options.offset))
  return params.toString()
}

export async function searchSkills(
  options: SearchOptions = {}
): Promise<SkillSearchResult> {
  const qs = buildQuery(options)
  try {
    const res = await fetch(`${REGISTRY_URL}/skills${qs ? `?${qs}` : ''}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return { skills: [], ...EMPTY_LIST }
    return res.json()
  } catch {
    return { skills: [], ...EMPTY_LIST }
  }
}

export async function searchSkillsets(
  options: SearchOptions = {}
): Promise<SkillsetSearchResult> {
  const qs = buildQuery(options)
  try {
    const res = await fetch(`${REGISTRY_URL}/skillsets${qs ? `?${qs}` : ''}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return { skillsets: [], ...EMPTY_LIST }
    return res.json()
  } catch {
    return { skillsets: [], ...EMPTY_LIST }
  }
}

/** Owner-qualified lookup. This is the canonical way to fetch a skill; it never 409s. */
export async function getSkill(
  owner: string,
  name: string
): Promise<RegistrySkill | null> {
  try {
    const res = await fetch(
      `${REGISTRY_URL}/skills/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

/**
 * Resolve a bare, unqualified skill name via the legacy endpoint.
 *
 * Distinguishes 409 AMBIGUOUS_NAME from 404 rather than collapsing both to null. That
 * collapse is why every contested name previously rendered as "not found": the registry was
 * answering "several skills have this name, pick one" and the site was reporting "no such
 * skill". At corpus scale that is ~41.5% of names.
 *
 * `error` is distinct from `not_found` so the caller can throw and let error.tsx render,
 * instead of showing a 404 for what is really an outage.
 */
export async function resolveBareName(name: string): Promise<BareNameResolution> {
  try {
    const res = await fetch(`${REGISTRY_URL}/skills/${encodeURIComponent(name)}`, {
      next: { revalidate: 60 },
    })

    if (res.ok) return { status: 'ok', skill: await res.json() }
    if (res.status === 404) return { status: 'not_found' }

    if (res.status === 409) {
      const body = await res.json().catch(() => ({}))
      return { status: 'ambiguous', owners: Array.isArray(body.owners) ? body.owners : [] }
    }

    return { status: 'error' }
  } catch {
    return { status: 'error' }
  }
}

export async function getSkillset(name: string): Promise<RegistrySkillset | null> {
  try {
    const res = await fetch(
      `${REGISTRY_URL}/skillsets/${encodeURIComponent(name)}`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

/**
 * Headline counts. O(1) on the API side — served from a precomputed table, never a count(*).
 *
 * Cached longer than search results: the numbers are refreshed by the nightly seeder, so a
 * 60s revalidate would just re-fetch an identical response.
 */
export async function getStats(): Promise<RegistryStats | null> {
  try {
    const res = await fetch(`${REGISTRY_URL}/stats`, { next: { revalidate: 300 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getTags(): Promise<TagCount[]> {
  try {
    const res = await fetch(`${REGISTRY_URL}/tags`, { next: { revalidate: 300 } })
    if (!res.ok) return []
    const body = await res.json()
    return Array.isArray(body.tags) ? body.tags : []
  } catch {
    return []
  }
}
