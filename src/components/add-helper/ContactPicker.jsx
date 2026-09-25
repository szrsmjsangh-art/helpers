import { useState } from 'react'
import { ContactRound, Loader2 } from 'lucide-react'

export default function ContactPicker({ onPick }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supported =
    typeof navigator !== 'undefined' &&
    !!navigator.contacts?.select

  const pick = async () => {
    if (!supported || loading) return

    setError('')
    setLoading(true)

    try {
      const contacts = await navigator.contacts.select(
        ['name', 'tel'],
        {
          multiple: true,
        }
      )

      if (contacts?.length) {
        onPick?.(contacts)
      }
    } catch (err) {
      if (err?.name !== 'AbortError') {
        setError('Unable to read selected contacts.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={pick}
        disabled={!supported || loading}
        className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#0c9b45] px-4 py-3.5 text-sm font-bold text-white shadow-[0_5px_14px_rgba(15,150,70,.2)] disabled:bg-[#9ca3a8] disabled:shadow-none"
      >
        {loading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <ContactRound size={20} />
        )}

        {loading
          ? 'Opening Contacts...'
          : supported
            ? 'Select from Contacts'
            : 'Select from Contacts (mobile browser)'}
      </button>

      {supported && (
        <p className="mt-1.5 text-center text-[9px] leading-4 text-[#858b92]">
          You can select multiple contacts at once.
        </p>
      )}

      {error && (
        <p className="mt-1.5 text-center text-[10px] text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}