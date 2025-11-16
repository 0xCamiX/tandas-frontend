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
