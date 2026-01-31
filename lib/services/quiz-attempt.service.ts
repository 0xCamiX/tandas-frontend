import { apiClient } from '@/lib/api-client'
import { getJWT } from '@/lib/auth'
import type { QuizAttempt } from '@/lib/types'

export type QuizAttemptResponse =
  | {
      success: true
      data: QuizAttempt
    }
  | {
      success: false
      error: {
        code: string
        message: string
      }
    }

export type QuizAttemptRequest = {
  quizId: string
  responses: {
    quizOptionId: string
  }[]
}

export async function createQuizAttemptService(
  quizId: string,
  responses: QuizAttemptRequest['responses'],
): Promise<QuizAttemptResponse> {
  const jwt = await getJWT()

  if (!jwt) {
    return {
      success: false,
      error: {
        code: 'NO_TOKEN',
        message: 'No authentication token found',
      },
    }
  }

  const endpoint = `/api/v1/quizzes/${quizId}/attempt`

  return apiClient.post<QuizAttempt>(endpoint, {
    requiresAuth: true,
    jwt,
    body: {
      quizId,
      responses,
    },
    cache: 'no-store',
  })
}
