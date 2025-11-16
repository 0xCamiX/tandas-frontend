import { apiClient } from '@/lib/api-client'
import { getJWT } from '@/lib/auth'
import type { Course, CourseLevel, CourseStatus, CourseWithModules } from '@/lib/types'

export type CourseFilters = {
  status?: CourseStatus
  category?: string
  level?: CourseLevel
  search?: string
}

export type CoursesResponse =
  | {
      success: true
      data: Course[]
    }
  | {
      success: false
      error: {
        code: string
        message: string
      }
    }

export async function getCoursesService(filters: CourseFilters = {}): Promise<CoursesResponse> {
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

  // Construir query params
  const params = new URLSearchParams()

  if (filters.status) {
    params.append('status', filters.status)
  }

  if (filters.category) {
    params.append('category', filters.category)
  }

  if (filters.level) {
    params.append('level', filters.level)
  }

  if (filters.search) {
    params.append('search', filters.search)
  }

  const queryString = params.toString()
  const endpoint = `/api/v1/courses${queryString ? `?${queryString}` : ''}`

  return apiClient.get<Course[]>(endpoint, {
    requiresAuth: true,
    jwt,
    cache: 'force-cache',
    next: {
      revalidate: 600, // Revalidar cada 10 minutos (cursos cambian poco frecuentemente)
      tags: [
        'courses',
      ],
    },
  })
}

export type CourseWithModulesResponse =
  | {
      success: true
      data: CourseWithModules
    }
  | {
      success: false
      error: {
        code: string
        message: string
      }
    }

export async function getCourseByIdService(courseId: string): Promise<CourseWithModulesResponse> {
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

  const endpoint = `/api/v1/courses/${courseId}/modules`

  return apiClient.get<CourseWithModules>(endpoint, {
    requiresAuth: true,
    jwt,
    cache: 'force-cache',
    next: {
      revalidate: 600, // Revalidar cada 10 minutos
      tags: [
        'courses',
        `course-${courseId}`,
      ],
    },
  })
}
