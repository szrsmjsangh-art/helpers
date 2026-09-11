export function useContactImport(){ const supported = typeof navigator !== 'undefined' && !!navigator.contacts?.select; return { supported } }
