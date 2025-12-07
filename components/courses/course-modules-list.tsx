import { Clock, PlayCircle } from 'lucide-react'
import type { CourseModule } from '@/lib/types'

type CourseModulesListProps = {
  modules: CourseModule[]
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}

export function CourseModulesList({ modules }: CourseModulesListProps) {
  const sortedModules = [
    ...modules,
  ].sort((a, b) => a.order - b.order)

  if (sortedModules.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>Este curso no tiene módulos disponibles aún.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sortedModules.map(module => (
        <div
          className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
          key={module.id}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {module.order}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{module.title}</h3>
            <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDuration(module.duration)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      ))}
    </div>
  )
}
