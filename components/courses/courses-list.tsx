import { BookOpen } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Course } from '@/lib/types'
import { CourseCard } from './course-card'

type CoursesListProps = {
  courses: Course[]
}

export function CoursesList({ courses }: CoursesListProps) {
  if (courses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
            <CardTitle>No se encontraron cursos</CardTitle>
            <CardDescription className="mt-2">
              Intenta ajustar los filtros de búsqueda para encontrar más resultados
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {courses.length} {courses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map(course => (
          <CourseCard course={course} key={course.id} />
        ))}
      </div>
    </div>
  )
}
