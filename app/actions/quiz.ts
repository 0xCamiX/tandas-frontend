'use server'

import { createQuizAttemptService } from '@/lib/services/quiz-attempt.service'

export type SubmitQuizAttemptActionResult =
  | {
      success: true
    }
  | {
      success: false
      error: string
      errorCode?: string
    }

export async function submitQuizAttemptAction(
  quizId: string,
  responses: {
    quizOptionId: string
  }[],
): Promise<SubmitQuizAttemptActionResult> {
  try {
    const response = await createQuizAttemptService(quizId, responses)

    if (!response.success) {
      return {
        success: false,
        error: response.error.message || 'Error al guardar el intento de quiz',
        errorCode: response.error.code,
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error en submitQuizAttemptAction:', error)
    return {
      success: false,
      error: 'Error inesperado al guardar el intento de quiz',
    }
  }
}
