export default function ErrorMessage({ message }) { return message ? <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{message}</div> : null }
