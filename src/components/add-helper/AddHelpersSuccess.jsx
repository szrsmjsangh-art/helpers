export default function AddHelpersSuccess({ count=1 }) { return <div className="rounded-2xl bg-emerald-50 p-5 text-emerald-800">{count} helper{count===1?'':'s'} submitted successfully.</div> }
