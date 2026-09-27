import { QueryClient } from '@tanstack/react-query'
import { STALE_HELPERS_MS, STALE_TAXONOMY_MS } from './queryKeys'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TAXONOMY_MS,
      gcTime: 24 * 60 * 60 * 1000,
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
})

export function invalidateHelperLists() {
  return queryClient.invalidateQueries({ queryKey: ['helpers'] })
}

export { STALE_HELPERS_MS, STALE_TAXONOMY_MS }
