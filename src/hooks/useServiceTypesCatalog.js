import { useQuery } from '@tanstack/react-query'
import { getAllServiceTypes } from '../services/categoryService'
import { queryKeys, STALE_TAXONOMY_MS } from '../lib/queryKeys'

export function useServiceTypesCatalog() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.serviceTypes,
    queryFn: getAllServiceTypes,
    staleTime: STALE_TAXONOMY_MS,
  })

  return {
    serviceTypes: data || [],
    loading: isLoading,
    error: error?.message || '',
  }
}
