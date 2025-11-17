import { ArrowLeft, BookOpen, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CourseEnrollmentCard } from '@/components/courses/course-enrollment-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCourseByIdService } from '@/lib/services/course.service'
import { checkEnrollmentStatusService } from '@/lib/services/enrollment.service'
import type { CourseLevel } from '@/lib/types'

type CourseDetailPageProps = {
  params: Promise<{
    courseId: string
  }>
}

const levelLabels: Record<CourseLevel, string> = {
  BEGINNER: 'Principiante',
  INTERMEDIATE: 'Intermedio',
  ADVANCED: 'Avanzado',
}

const categoryLabels: Record<string, string> = {
  sedimentación: 'Sedimentación',
  filtración: 'Filtración',
  desinfección: 'Desinfección',
  'almacenamiento seguro': 'Almacenamiento',
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { courseId } = await params

  const courseResponse = await getCourseByIdService(courseId)

  if (!courseResponse.success) {
    redirect('/dashboard/courses')
  }

  const course = courseResponse.data

  const enrollmentStatusResponse = await checkEnrollmentStatusService(courseId)
  const isEnrolled = enrollmentStatusResponse.success
    ? enrollmentStatusResponse.data.enrolled
    : false

  const totalDuration = course.modules.reduce((total, module) => total + (module.duration || 0), 0)

  const sortedModules = [
    ...course.modules,
  ].sort((a, b) => a.order - b.order)

  return (
    <div className="container py-8">
      {/* Botón volver */}
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard/courses">
          <Button size="sm" variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a cursos
          </Button>
        </Link>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contenido principal */}
        <div className="lg:col-span-2">
          {/* Título y descripción */}
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-muted-foreground mb-6">{course.description}</p>

          {/* Imagen del curso */}
          <div
            className="relative overflow-hidden rounded-lg bg-muted mb-8"
            style={{
              width: '600px',
              height: '300px',
            }}
          >
            {course.imageUrl ? (
              <Image
                alt={course.title}
                className="object-cover rounded-lg"
                fill
                src={course.imageUrl}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <BookOpen className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Badges de información */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>{totalDuration} minutos</span>
            </div>
            <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <span>{course.modules.length} módulos</span>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-md">
              <span>{categoryLabels[course.category] || course.category}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md">
              <span>{levelLabels[course.level]}</span>
            </div>
          </div>

          {/* Contenido del curso */}
          <h2 className="text-xl font-semibold mb-4">Contenido del curso</h2>
          <div className="space-y-4">
            {sortedModules.map((module, index) => (
              <Card key={module.id}>
                <CardHeader className="py-4">
                  <CardTitle className="text-lg">
                    Módulo {index + 1}: {module.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{module.duration} minutos</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Inscríbete para acceder a este módulo
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar de inscripción */}
        <div className="lg:col-span-1">
          <CourseEnrollmentCard course={course} isEnrolled={isEnrolled} />
        </div>
      </div>
    </div>
  )
}
