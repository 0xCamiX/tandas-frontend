export function FormError({ issues }: { issues?: string[] }) {
  if (!issues || issues.length === 0) return null

  return (
    <div className="pt-1">
      {issues.map(issue => (
        <p
          className="text-xs text-red-500 animate-in fade-in-0 slide-in-from-top-1 duration-200"
          key={issue}
        >
      {issue}
    </p>
      ))}
    </div>
  )
}
