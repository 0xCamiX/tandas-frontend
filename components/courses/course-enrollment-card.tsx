'use client'

import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { CourseWithModules } from '@/lib/types'

type CourseEnrollmentCardProps = {
  course: CourseWithModules
}

export function CourseEnrollmentCard({ course }: CourseEnrollmentCardProps) {
  // TODO: Obtener estado de inscripción del usuario
  const isEnrolled = false
  const enrolling = false

  const handleEnroll = () => {
    // TODO: Implementar inscripción al curso
    console.log('Inscribirse al curso:', course.id)
  }

  const sortedModules = [...course.modules].sort((a, b) => a.order - b.order)

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
          <Button className="w-full" onClick={handleEnroll} disabled={enrolling}>
            {enrolling ? 'Inscribiendo...' : 'Inscribirme al curso'}
          </Button>
        )}

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Lo que aprenderás:</h3>
          <ul className="space-y-2">
            {sortedModules.map((module) => (
              <li key={module.id} className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
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
