import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../services/categoryService'
import { queryKeys, STALE_TAXONOMY_MS } from '../lib/queryKeys'

export function useCategories() {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: getCategories,
    staleTime: STALE_TAXONOMY_MS,
  })

  return {
    categories: data || [],
    loading: isLoading,
    error: error?.message || '',
    isRefreshing: isFetching && !isLoading,
  }
}
