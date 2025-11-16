import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CourseWithModules } from '@/lib/types'

type ModuleSidebarProps = {
  course: CourseWithModules
  currentModuleId: string
}

export function ModuleSidebar({ course, currentModuleId }: ModuleSidebarProps) {
  const sortedModules = [
    ...course.modules,
  ].sort((a, b) => a.order - b.order)

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg">Contenido del curso</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-1">
          {sortedModules.map((module, index) => {
            const isCurrent = module.id === currentModuleId

            return (
              <Link
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  isCurrent ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
                href={`/dashboard/courses/${course.id}/${module.id}`}
                key={module.id}
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted-foreground/20">
                  {index + 1}
                </div>
                <span className="line-clamp-1">{module.title}</span>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
