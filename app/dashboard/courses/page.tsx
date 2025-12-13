import { BookOpen } from 'lucide-react'
import { Suspense } from 'react'
import { CoursesFilters } from '@/components/courses/courses-filters'
import { CoursesList } from '@/components/courses/courses-list'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { getCoursesService } from '@/lib/services/course.service'
import { type CourseLevel, CourseStatus } from '@/lib/types'

type CoursesPageProps = {
  searchParams: Promise<{
    search?: string
    status?: string
    category?: string
    level?: string
  }>
}

function CoursesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from(
        {
          length: 6,
        },
        (_, i) => `skeleton-${i}`,
      ).map(id => (
        <Card key={id}>
          <Skeleton className="h-48 w-full" />
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function CoursesContent({
  search,
  status,
  category,
  level,
}: {
  search?: string
  status?: string
  category?: string
  level?: string
}) {
  const coursesResponse = await getCoursesService({
    search: search || undefined,
    status: (status as CourseStatus) || CourseStatus.ACTIVO,
    category: category || undefined,
    level: (level as CourseLevel) || undefined,
  })

  if (!coursesResponse.success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error al cargar cursos</CardTitle>
          <CardDescription>{coursesResponse.error.message}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const courses = coursesResponse.data

  return <CoursesList courses={courses} />
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams
  const { search, status, category, level } = params

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Catálogo de Cursos</h1>
            <p className="text-muted-foreground">
              Explora nuestro catálogo completo sobre pretratamiento de agua
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Búsqueda</CardTitle>
          <CardDescription>Busca y filtra cursos según tus necesidades</CardDescription>
        </CardHeader>
        <CardContent>
          <CoursesFilters />
        </CardContent>
      </Card>

      {/* Courses List */}
      <Suspense fallback={<CoursesSkeleton />}>
        <CoursesContent category={category} level={level} search={search} status={status} />
      </Suspense>
    </div>
  )
}
