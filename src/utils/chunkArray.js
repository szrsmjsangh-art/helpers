export function chunkArray(items, size) {
  if (size <= 0) return [items]
  const chunks = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}
