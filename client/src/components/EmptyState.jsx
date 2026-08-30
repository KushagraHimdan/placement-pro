export default function EmptyState({ message }) {
  return (
    <div className="flex items-center justify-center py-20 text-center">
      <p className="text-slate text-sm max-w-xs">{message}</p>
    </div>
  )
}