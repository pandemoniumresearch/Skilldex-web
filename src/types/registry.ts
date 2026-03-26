// API response shape from the registry backend
export type RegistrySkill = {
  name: string
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

// Search options matching GET /skills query params
export type SearchOptions = {
  q?: string
  tier?: string
  sort?: string
  limit?: number
  offset?: number
}

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
