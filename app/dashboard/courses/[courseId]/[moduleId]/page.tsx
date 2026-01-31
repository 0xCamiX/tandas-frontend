import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ModulePageContent } from '@/components/modules/module-page-content'
import { getCourseByIdService } from '@/lib/services/course.service'
import { checkEnrollmentStatusService } from '@/lib/services/enrollment.service'
import {
  getModuleWithRelationsService,
  getQuizWithOptionsService,
} from '@/lib/services/module.service'
import type { CourseModule, QuizWithOptions } from '@/lib/types'

type ModulePageParams = Promise<{
  courseId: string
  moduleId: string
}>

type ModulePageProps = {
  params: ModulePageParams
}

// Generar metadata dinámica para SEO
// biome-ignore lint/style/useComponentExportOnlyModules: <"Next.js 16 convention for dynamic metadata">
export async function generateMetadata({ params }: ModulePageProps): Promise<Metadata> {
  const { courseId, moduleId } = await params

  try {
    const [courseResponse, moduleResponse] = await Promise.all([
      getCourseByIdService(courseId),
      getModuleWithRelationsService(moduleId),
    ])

    if (courseResponse.success && moduleResponse.success) {
      const course = courseResponse.data
      const module = moduleResponse.data

      return {
        title: `${module.title} - ${course.title} | YAKU`,
        description:
          module.content
            ?.replace(/<[^>]*>/g, '')
            .substring(0, 160)
            .trim() || course.description,
      }
    }
  } catch {
    // Si hay error, devolver metadata por defecto
  }

  return {
    title: 'Módulo | YAKU',
    description: 'Contenido del módulo de aprendizaje',
  }
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { courseId, moduleId } = await params

  // Obtener datos del curso y módulo en paralelo
  const [courseResponse, moduleResponse, enrollmentStatusResponse] = await Promise.all([
    getCourseByIdService(courseId),
    getModuleWithRelationsService(moduleId),
    checkEnrollmentStatusService(courseId),
  ])

  // Si el curso no existe, redirigir a cursos
  if (!courseResponse.success) {
    console.error('[ModulePage] Curso no encontrado:', courseId, courseResponse.error)
    redirect('/dashboard/courses')
  }

  const course = courseResponse.data

  // Si el módulo no existe, redirigir al curso
  if (!moduleResponse.success) {
    console.error('[ModulePage] Error al obtener módulo:', moduleId, moduleResponse.error)

    // Verificar si el error es de red/backend
    if (moduleResponse.error.code === 'NETWORK_ERROR') {
      console.error(
        '[ModulePage] Error de red - El backend puede no estar corriendo o el endpoint no existe',
      )
    }

    redirect(`/dashboard/courses/${courseId}`)
  }

  const module = moduleResponse.data

  // Verificar que el módulo pertenece al curso correcto
  const moduleCourseId = module.courseId ?? module.course?.id ?? null

  if (moduleCourseId !== courseId) {
    console.error('[ModulePage] Módulo no pertenece al curso:', {
      moduleId,
      courseId,
      moduleCourseId,
    })
    redirect(`/dashboard/courses/${courseId}`)
  }

  // Verificar inscripción del usuario (solo advertir, no bloquear)
  if (!enrollmentStatusResponse.success) {
    console.warn('[ModulePage] No se pudo verificar inscripción:', enrollmentStatusResponse.error)
  } else if (!enrollmentStatusResponse.data.enrolled) {
    console.warn('[ModulePage] Usuario no inscrito en el curso:', {
      courseId,
      userId: 'current',
    })
    redirect(`/dashboard/courses/${courseId}`)
  }

  // Obtener quizzes del módulo
  const quizzes = await fetchQuizzes(module.quizzes ?? [])

  // Obtener navegación entre módulos
  const { prevModule, nextModule, position, totalModules } = getModuleNavigation(
    course.modules,
    moduleId,
  )

  return (
    <ModulePageContent
      course={course}
      courseId={courseId}
      currentModuleId={moduleId}
      module={module}
      navigation={{
        prevModule,
        nextModule,
        position,
        totalModules,
      }}
      quizzes={quizzes}
    />
  )
}

async function fetchQuizzes(
  quizzes: {
    id: string
  }[],
): Promise<QuizWithOptions[]> {
  if (quizzes.length === 0) {
    return []
  }

  const responses = await Promise.all(quizzes.map(quiz => getQuizWithOptionsService(quiz.id)))

  return responses
    .filter(
      (
        response,
      ): response is {
        success: true
        data: QuizWithOptions
      } => response.success,
    )
    .map(response => response.data)
}

function getModuleNavigation(modules: CourseModule[], moduleId: string) {
  if (modules.length === 0) {
    return {
      prevModule: null,
      nextModule: null,
      position: null,
      totalModules: 0,
    }
  }

  const sortedModules = [
    ...modules,
  ].sort((a, b) => a.order - b.order)
  const currentIndex = sortedModules.findIndex(module => module.id === moduleId)

  if (currentIndex === -1) {
    return {
      prevModule: null,
      nextModule: null,
      position: null,
      totalModules: sortedModules.length,
    }
  }

  return {
    prevModule: currentIndex > 0 ? sortedModules[currentIndex - 1] : null,
    nextModule: currentIndex < sortedModules.length - 1 ? sortedModules[currentIndex + 1] : null,
    position: currentIndex + 1,
    totalModules: sortedModules.length,
  }
}
