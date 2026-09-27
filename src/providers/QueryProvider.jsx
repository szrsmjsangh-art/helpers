import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { queryClient } from '../lib/queryClient'

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'maru-bharuch-query-cache',
})

const persistMaxAge = 24 * 60 * 60 * 1000

export default function QueryProvider({ children }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: persistMaxAge,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            const root = query.queryKey[0]
            if (root === 'categories' || root === 'serviceTypes') return true
            if (root === 'helpers' && query.queryKey[1] === 'recent') return true
            return false
          },
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  )
}
