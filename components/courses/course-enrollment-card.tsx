'use client'

import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { enrollCourseAction } from '@/app/actions/enrollment'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { CourseWithModules } from '@/lib/types'

type CourseEnrollmentCardProps = {
  course: CourseWithModules
  isEnrolled?: boolean
}

export function CourseEnrollmentCard({ course, isEnrolled = false }: CourseEnrollmentCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const sortedModules = [
    ...course.modules,
  ].sort((a, b) => a.order - b.order)
  const firstModuleId = sortedModules.length > 0 ? sortedModules[0].id : undefined

  const handleEnroll = () => {
    startTransition(async () => {
      const result = await enrollCourseAction(course.id, firstModuleId)

      // Determinar la ruta de redirección
      let redirectPath: string | null = null

      if (!result.success) {
        // Si el error es ALREADY_ENROLLED, redirigir al primer módulo
        if (result.errorCode === 'ALREADY_ENROLLED') {
          redirectPath = firstModuleId
            ? `/dashboard/courses/${course.id}/${firstModuleId}`
            : `/dashboard/courses/${course.id}`
        } else {
          // Otros errores
          console.error('Error al inscribirse:', result.error)
          alert(result.error) // Temporal, deberías usar un toast
        }
      } else {
        // Si es exitoso y hay módulo, redirigir
        redirectPath = result.firstModuleId
          ? `/dashboard/courses/${course.id}/${result.firstModuleId}`
          : `/dashboard/courses/${course.id}`
      }

      // Redirigir fuera del useTransition usando setTimeout para asegurar que se ejecute
      if (redirectPath) {
        // Usar replace para evitar problemas con el historial y asegurar la navegación
        router.replace(redirectPath!)
      }
    })
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Inscripción al curso</CardTitle>
        <CardDescription>Aprende técnicas efectivas de pretratamiento de agua</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEnrolled ? (
          <div className="flex flex-col items-center text-center p-4">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
            <h3 className="text-lg font-medium">¡Ya estás inscrito!</h3>
            <p className="text-muted-foreground mb-4">
              Puedes acceder a todos los módulos del curso
            </p>
            {sortedModules.length > 0 && (
              <Link href={`/dashboard/courses/${course.id}/${sortedModules[0].id}`}>
                <Button className="w-full">Comenzar curso</Button>
              </Link>
            )}
          </div>
        ) : (
          <Button className="w-full" disabled={isPending} onClick={handleEnroll}>
            {isPending ? 'Inscribiendo...' : 'Inscribirme al curso'}
          </Button>
        )}

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Lo que aprenderás:</h3>
          <ul className="space-y-2">
            {sortedModules.map(module => (
              <li className="flex items-start gap-2" key={module.id}>
                <svg
                  className="h-5 w-5 text-primary shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Checkmark</title>
                  <path
                    clipRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    fillRule="evenodd"
                  />
                </svg>
                <span className="text-sm">{module.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
