import { apiClient } from '@/lib/api-client'
import { getJWT } from '@/lib/auth'
import type { CourseProgress, User, UserStats } from '@/lib/types'

export type UserResponse =
  | {
      success: true
      data: User
    }
  | {
      success: false
      error: {
        code: string
        message: string
      }
    }

export type UserStatsResponse =
  | {
      success: true
      data: UserStats
    }
  | {
      success: false
      error: {
        code: string
        message: string
      }
    }

export type UserProgressResponse =
  | {
      success: true
      data: CourseProgress[]
    }
  | {
      success: false
      error: {
        code: string
        message: string
      }
    }

export async function getCurrentUserService(): Promise<UserResponse> {
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

  return apiClient.get<User>('/api/v1/users/me', {
    requiresAuth: true,
    jwt,
    cache: 'force-cache',
    next: {
      revalidate: 300,
      tags: [
        'user-profile',
      ],
    },
  })
}

export async function getUserStatsService(): Promise<UserStatsResponse> {
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

  return apiClient.get<UserStats>('/api/v1/users/me/stats', {
    requiresAuth: true,
    jwt,
    cache: 'no-store',
  })
}

export async function getUserProgressService(): Promise<UserProgressResponse> {
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

  return apiClient.get<CourseProgress[]>('/api/v1/users/me/progress', {
    requiresAuth: true,
    jwt,
    cache: 'no-store',
  })
}
