export const queryKeys = {
  categories: ['categories'],
  serviceTypes: ['serviceTypes'],
  helpersRecent: ['helpers', 'recent'],
  helpersAll: ['helpers', 'all'],
  helpersByCategory: (categoryId) => ['helpers', 'category', categoryId],
}

export const STALE_TAXONOMY_MS = 30 * 60 * 1000
export const STALE_HELPERS_MS = 5 * 60 * 1000
