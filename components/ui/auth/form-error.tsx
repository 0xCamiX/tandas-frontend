export function FormError({ issues }: { issues?: string[] }) {
  if (!issues || issues.length === 0) return null
  return issues.map(issue => (
    <p className="text-red-500" key={issue}>
      {issue}
    </p>
  ))
}
