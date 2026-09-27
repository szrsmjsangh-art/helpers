import { Download, Share, X } from 'lucide-react'
import { usePwaInstall } from '../../hooks/usePwaInstall'

export default function InstallAppButton() {
  const {
    showInstallButton,
    install,
    iosHintOpen,
    closeIosHint,
    canShowIosHelp,
  } = usePwaInstall()

  if (!showInstallButton) return null

  return (
    <>
      <button
        type="button"
        onClick={install}
        className="flex shrink-0 items-center gap-1 rounded-xl border border-[#b8e6c8] bg-[#eef9f0] px-2.5 py-2 text-[10px] font-bold text-[#0c9b45] hover:bg-[#e4f5e9]"
        aria-label="Install app"
      >
        <Download size={14} aria-hidden />
        Install
      </button>

      {iosHintOpen && canShowIosHelp && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-install-title"
        >
          <div className="w-full max-w-[400px] rounded-2xl bg-white p-4 shadow-xl">
            <div className="flex items-start justify-between gap-2">
              <h2
                id="ios-install-title"
                className="text-[15px] font-black text-[#19212d]"
              >
                Install on iPhone
              </h2>
              <button
                type="button"
                onClick={closeIosHint}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4f5f6] text-[#555]"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <ol className="mt-3 space-y-2 text-[12px] leading-5 text-[#555d67]">
              <li className="flex gap-2">
                <span className="font-bold text-[#0c9b45]">1.</span>
                Tap the <Share size={14} className="inline text-[#0c9b45]" />{' '}
                Share button in Safari (bottom bar).
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#0c9b45]">2.</span>
                Choose <strong>Add to Home Screen</strong>.
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#0c9b45]">3.</span>
                Tap <strong>Add</strong> — the app icon will appear on your home
                screen.
              </li>
            </ol>

            <button
              type="button"
              onClick={closeIosHint}
              className="mt-4 w-full rounded-xl bg-[#0c9b45] py-3 text-sm font-bold text-white"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  )
}
