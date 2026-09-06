/**
 * Render a total that may be a lower bound.
 *
 * `total_relation: "gte"` means the registry stopped counting at the cap — there are at least
 * this many. Printing the bare number would state a precise figure that is simply wrong, which
 * is the failure mode the relation flag exists to prevent.
 */
export function formatTotal(total: number, relation: 'eq' | 'gte'): string {
  return relation === 'gte' ? `${total.toLocaleString()}+` : total.toLocaleString()
}
