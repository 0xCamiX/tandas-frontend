import { apiClient } from '@/lib/api-client'
import { getJWT } from '@/lib/auth'
import type { Module, ModuleWithRelations, QuizWithOptions } from '@/lib/types'

export type ModuleResponse =
  | {
      success: true
      data: Module
    }
  | {
      success: false
      error: {
        code: string
        message: string
      }
    }

export type ModuleWithRelationsResponse =
  | {
      success: true
      data: ModuleWithRelations
    }
  | {
      success: false
      error: {
        code: string
        message: string
      }
    }

export type QuizWithOptionsResponse =
  | {
      success: true
      data: QuizWithOptions
    }
  | {
      success: false
      error: {
        code: string
        message: string
      }
    }

export async function getModuleByIdService(moduleId: string): Promise<ModuleResponse> {
  const jwt = await getJWT()

  const endpoint = `/api/v1/modules/${moduleId}`

  return apiClient.get<Module>(endpoint, {
    requiresAuth: true,
    jwt: jwt || null,
    cache: 'force-cache',
    next: {
      revalidate: 600,
      tags: [
        'modules',
        `module-${moduleId}`,
      ],
    },
  })
}

export async function getModuleWithRelationsService(
  moduleId: string,
): Promise<ModuleWithRelationsResponse> {
  const jwt = await getJWT()

  const endpoint = `/api/v1/modules/${moduleId}/relations`

  return apiClient.get<ModuleWithRelations>(endpoint, {
    requiresAuth: true,
    jwt: jwt || null,
    cache: 'force-cache',
    next: {
      revalidate: 600,
      tags: [
        'modules',
        `module-${moduleId}`,
      ],
    },
  })
}

export async function getQuizWithOptionsService(quizId: string): Promise<QuizWithOptionsResponse> {
  const jwt = await getJWT()

  const endpoint = `/api/v1/quizzes/${quizId}/options`

  return apiClient.get<QuizWithOptions>(endpoint, {
    requiresAuth: true,
    jwt: jwt || null,
    cache: 'force-cache',
    next: {
      revalidate: 300,
      tags: [
        'quizzes',
        `quiz-${quizId}`,
      ],
    },
  })
}
