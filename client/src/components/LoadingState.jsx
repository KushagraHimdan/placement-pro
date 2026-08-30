export default function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="flex items-center gap-3 text-slate">
        <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
        <span className="font-mono text-sm">{label}</span>
      </div>
    </div>
  )
}