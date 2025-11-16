import { redirect } from 'next/navigation'
import { ModulePageContent } from '@/components/modules/module-page-content'
import { getCourseByIdService } from '@/lib/services/course.service'
import {
  getModuleWithRelationsService,
  getQuizWithOptionsService,
} from '@/lib/services/module.service'
import type {
  CourseModule,
  CourseWithModules,
  ModuleWithRelations,
  Quiz,
  QuizWithOptions,
} from '@/lib/types'
import { CourseLevel, CourseStatus } from '@/lib/types'

type ModulePageParams = Promise<{
  courseId: string
  moduleId: string
}>

type ModulePageProps = {
  params: ModulePageParams
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { courseId, moduleId } = await params

  const [courseResponse, moduleResponse] = await Promise.all([
    getCourseByIdService(courseId),
    getModuleWithRelationsService(moduleId),
  ])

  const course = courseResponse.success ? courseResponse.data : getMockCourse(courseId)
  const module = moduleResponse.success ? moduleResponse.data : getMockModule(moduleId, courseId)

  if (!courseResponse.success) {
    console.warn('[module-page] usando mock de curso para', courseId)
  }

  if (!moduleResponse.success) {
    console.warn('[module-page] usando mock de módulo para', moduleId)
  }

  const moduleCourseId = module.courseId ?? module.course?.id ?? null

  if (moduleCourseId && moduleCourseId !== courseId) {
    redirect(`/dashboard/courses/${courseId}`)
  }

  const quizzes = await fetchQuizzes(module.quizzes ?? [])
  const { prevModule, nextModule, position, totalModules } = getModuleNavigation(
    course.modules,
    moduleId,
  )

  return (
    <ModulePageContent
      course={course as CourseWithModules}
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

function getMockCourse(courseId: string): CourseWithModules {
  return {
    id: courseId,
    title: 'Curso de Sedimentación',
    description: 'Aprende técnicas fundamentales de pretratamiento de agua.',
    imageUrl: '/images/course-placeholder.png',
    category: 'sedimentación',
    level: CourseLevel.BEGINNER,
    status: CourseStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    modules: [
      {
        id: 'mock-module-1',
        title: 'Introducción a la sedimentación',
        order: 1,
        duration: 30,
      },
      {
        id: 'mock-module-2',
        title: 'Parámetros operativos',
        order: 2,
        duration: 40,
      },
    ],
  }
}

function getMockModule(moduleId: string, courseId: string): ModuleWithRelations {
  return {
    id: moduleId,
    courseId,
    title: 'Módulo de ejemplo',
    content:
      '<h2>Contenido simulado</h2><p>Este módulo muestra texto e imágenes de prueba para la UI.</p>',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    order: 1,
    duration: 35,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    course: {
      id: courseId,
      title: 'Curso de Sedimentación',
    },
    quizzes: getMockQuizzes(),
    resources: [
      {
        id: 'mock-resource-1',
        resourceType: 'PDF',
        url: 'https://example.com/resource.pdf',
        title: 'Guía rápida de sedimentación',
      },
    ],
  }
}

function getMockQuizzes(): Quiz[] {
  return [
    {
      id: 'mock-quiz-1',
      moduleId: 'mock-module-1',
      question: '¿Cuál es el objetivo principal de la sedimentación?',
      type: 'MULTIPLE_CHOICE',
      explanation: 'Separar sólidos suspendidos por gravedad antes de los procesos posteriores.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]
}
