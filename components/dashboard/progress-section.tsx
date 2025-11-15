import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { CourseProgress } from '@/lib/types'

type ProgressSectionProps = {
  progress: CourseProgress[]
}

export function ProgressSection({ progress }: ProgressSectionProps) {
  if (progress.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mi Progreso</CardTitle>
          <CardDescription>Revisa tu progreso en los cursos</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Aún no tienes progreso en ningún curso. ¡Comienza a aprender!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mi Progreso</CardTitle>
        <CardDescription>Revisa tu progreso en los cursos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {progress.map(course => (
            <div key={course.courseId} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{course.courseTitle}</h3>
                <span className="text-sm font-medium text-muted-foreground">
                  {course.completedModules} / {course.totalModules} módulos
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {course.progress.toFixed(1)}% completado
                </span>
                {course.completedAt && (
                  <span className="text-muted-foreground">
                    Completado: {new Date(course.completedAt).toLocaleDateString('es-ES')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

