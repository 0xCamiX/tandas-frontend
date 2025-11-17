import { apiClient } from '@/lib/api-client'
import { getJWT } from '@/lib/auth'

export type Enrollment = {
  id: string
  userId: string
  courseId: string
  enrolledAt: string
  progress: number
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export type EnrollCourseResponse =
  | {
      success: true
      data: Enrollment
      message?: string
    }
  | {
      success: false
      error: {
        code: string
        message: string
      }
    }

export type EnrollmentStatusResponse =
  | {
      success: true
      data: {
        enrolled: boolean
      }
    }
  | {
      success: false
      error: {
        code: string
        message: string
      }
    }

export async function checkEnrollmentStatusService(
  courseId: string,
): Promise<EnrollmentStatusResponse> {
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

  // Intentar el endpoint directo primero
  const endpoint = `/api/v1/enrollments/courses/${courseId}`

  const response = await apiClient.get<{
    enrolled: boolean
  }>(endpoint, {
    requiresAuth: true,
    jwt,
    cache: 'no-store',
  })

  // Si el endpoint directo falla, usar alternativa
  if (!response.success && response.error.code === '404') {
    // Fallback: Obtener todas las inscripciones y buscar el curso
    const myEnrollmentsResponse = await apiClient.get<Enrollment[]>('/api/v1/enrollments/me', {
      requiresAuth: true,
      jwt,
      cache: 'no-store',
    })

    if (myEnrollmentsResponse.success) {
      const enrollments = myEnrollmentsResponse.data
      const enrolled = enrollments.some(enrollment => enrollment.courseId === courseId)

      return {
        success: true,
        data: {
          enrolled,
        },
      }
    }
  }

  return response
}

export async function enrollCourseService(courseId: string): Promise<EnrollCourseResponse> {
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

  const endpoint = `/api/v1/enrollments/courses/${courseId}`

  return apiClient.post<Enrollment>(endpoint, {
    requiresAuth: true,
    jwt,
    body: {},
    cache: 'no-store',
  })
}
