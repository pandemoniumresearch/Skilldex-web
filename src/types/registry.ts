// API response shape from the registry backend
export type RegistrySkill = {
  name: string
  /** The authored name before slugification. 6.7% of imported names differ from `name`. */
  display_name: string | null
  /**
   * Names are unique only within an owner — 41.5% of corpus names collide on the bare name —
   * so every link to a skill must carry the owner.
   */
  owner: string
  /** "owner/name". How the registry addresses a skill. */
  qualified_name: string
  description: string
  author: string | null
  source_url: string
  trust_tier: 'verified' | 'community'
  score: number | null
  spec_version: string
  tags: string[]
  install_count: number
  published_at: string
}

export type RegistrySkillset = {
  name: string
  description: string
  author: string | null
  source_url: string
  trust_tier: 'verified' | 'community'
  score: number | null
  spec_version: string
  tags: string[]
  skill_count: number
  install_count: number
  published_at: string
  skills: Array<{ name: string; source_url: string }>
}

// Search options matching GET /skills and GET /skillsets query params
export type SearchOptions = {
  q?: string
  tier?: string
  sort?: string
  tags?: string
  owner?: string
  /**
   * "curated" (default) is what the seeder and publishers put in the registry; "all" adds the
   * imported corpus. The API defaults to curated, so omitting this is safe.
   */
  scope?: 'curated' | 'all'
  limit?: number
  offset?: number
}

/**
 * Paginated list envelope.
 *
 * `total_relation` is the important field: "eq" means `total` is exact, "gte" means the count
 * stopped at the cap and there are at least that many. Render "gte" as "10,000+", never as a
 * bare 10000 — see COUNTING_AT_SCALE.md in the registry repo.
 */
export type ListEnvelope = {
  total: number
  total_relation: 'eq' | 'gte'
  has_more: boolean
  limit: number
  offset: number
  max_offset: number
}

export type SkillSearchResult = ListEnvelope & { skills: RegistrySkill[] }
export type SkillsetSearchResult = ListEnvelope & { skillsets: RegistrySkillset[] }

export type RegistryStats = {
  skills: { total: number; curated: number; imported: number; verified: number }
  skillsets: { total: number }
  owners: number
  updated_at: string | null
}

export type TagCount = { tag: string; skill_count: number }

/**
 * Result of resolving a bare, unqualified skill name.
 *
 * A discriminated union rather than `RegistrySkill | null`, because the registry answers a
 * contested name with 409 AMBIGUOUS_NAME — and collapsing that into null is what made every
 * contested skill render as a 404.
 */
export type BareNameResolution =
  | { status: 'ok'; skill: RegistrySkill }
  | { status: 'ambiguous'; owners: string[] }
  | { status: 'not_found' }
  | { status: 'error' }

// Legacy component-level type — kept for RegistryPreview backward compat
export type SkillCard = {
  name: string
  description: string
  tier: 'Verified' | 'Community'
  score: number | null
  specVersion: string
  installCommand: string
  sourceUrl: string
  installCount: number
}
