import { NextResponse } from 'next/server'
import { searchSkills } from '@/lib/registry'
import type { SearchOptions } from '@/types/registry'

/**
 * Load-more backend for the registry browse page.
 *
 * A Route Handler rather than a Server Action, deliberately. Server Actions are POSTs: not
 * CDN-cacheable, not browser-cacheable, serialised by Next so concurrent calls queue, and they
 * carry the action-id protocol for what is a plain idempotent read. A GET with a URL is
 * cacheable at three layers, debuggable by pasting it in a browser, and testable with curl.
 *
 * It also exists so the browser never needs REGISTRY_URL. That variable is server-only; making
 * it NEXT_PUBLIC_ would bypass Next's Data Cache entirely and send every click straight to
 * Turso.
 */
export async function GET(request: Request) {
  const p = new URL(request.url).searchParams

  const limit = Math.min(Math.max(Number(p.get('limit')) || 24, 1), 100)
  const offset = Math.max(Number(p.get('offset')) || 0, 0)

  const options: SearchOptions = {
    q: p.get('q') ?? undefined,
    tier: p.get('tier') ?? undefined,
    sort: p.get('sort') ?? undefined,
    tags: p.get('tags') ?? undefined,
    source: (p.get('source') as SearchOptions['source']) ?? undefined,
    limit,
    offset,
  }

  const result = await searchSkills(options)

  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' },
  })
}
