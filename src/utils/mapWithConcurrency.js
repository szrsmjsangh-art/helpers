/**
 * Run async mapper over items with at most `concurrency` tasks in flight.
 */
export async function mapWithConcurrency(items, concurrency, mapper) {
  if (!items.length) return []

  const limit = Math.max(1, Math.min(concurrency, items.length))
  const results = new Array(items.length)
  let nextIndex = 0

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex
      nextIndex += 1
      results[index] = await mapper(items[index], index)
    }
  }

  await Promise.all(Array.from({ length: limit }, worker))
  return results
}
