/**
 * @deprecated Use types from '@/lib/types' instead
 * This file is kept for backward compatibility
 */
import type { CourseProgress, LoginUserData, RegisterUserData, User, UserStats } from './types'

export type { User, RegisterUserData, LoginUserData, UserStats, CourseProgress }

type RegisterUserSuccess = {
  success: true
  data: {
    token: string
    user: User
  }
}

type RegisterUserError = {
  success: false
  error: {
    code: string
    message: string
  }
}

export type RegisterUserResponse = RegisterUserSuccess | RegisterUserError

type LoginUserSuccess = {
  success: true
  data: {
    user: User
    token: string
  }
}

type LoginUserError = {
  success: false
  error: {
    code: string
    message: string
  }
}

export type LoginUserResponse = LoginUserSuccess | LoginUserError

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

/**
 * @deprecated Use types from '@/lib/types' instead
 */
export type UserStatsResponse =
  | {
      success: true
      data: import('./types').UserStats
    }
  | {
      success: false
      error: {
        code: string
        message: string
      }
    }

/**
 * @deprecated Use types from '@/lib/types' instead
 */

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

/**
 * @deprecated Use '@/lib/services/auth.service' instead
 */
export async function registerUserService(
  userData: RegisterUserData,
): Promise<RegisterUserResponse> {
  const url = `${process.env.BACKEND_URL}/api/auth/sign-up/email`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include', // Importante para recibir cookies
    })

    const data = await response.json()

    // Obtener el token del header set-auth-token (Better Auth con plugin Bearer)
    const token = response.headers.get('set-auth-token')

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: data.code || data.error?.code || String(response.status),
          message: data.message || data.error?.message || 'Registration failed',
        },
      }
    }

    // Si tenemos token del header y datos del usuario del body
    if (token && data.user) {
      return {
        success: true,
        data: {
          token: token,
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            image: data.user.image,
            emailVerified: data.user.emailVerified,
            createdAt: data.user.createdAt,
            updatedAt: data.user.updatedAt,
          },
        },
      }
    }

    // Fallback: si el token viene en el body (por si acaso)
    if (data.token && data.user) {
      return {
        success: true,
        data: {
          token: data.token,
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            image: data.user.image,
            emailVerified: data.user.emailVerified,
            createdAt: data.user.createdAt,
            updatedAt: data.user.updatedAt,
          },
        },
      }
    }

    return {
      success: false,
      error: {
        code: data.code || data.error?.code || 'UNKNOWN_ERROR',
        message: data.message || data.error?.message || 'Registration failed',
      },
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please try again',
      },
    }
  }
}

/**
 * @deprecated Use '@/lib/services/auth.service' instead
 */
export async function loginUserService(userData: LoginUserData): Promise<LoginUserResponse> {
  const url = `${process.env.BACKEND_URL}/api/auth/sign-in/email`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include', // Importante para recibir cookies
    })

    const data = await response.json()

    // Obtener el token del header set-auth-token (Better Auth con plugin Bearer)
    const token = response.headers.get('set-auth-token')

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: data.code || data.error?.code || String(response.status),
          message: data.message || data.error?.message || 'Login failed',
        },
      }
    }

    // Si tenemos token del header y datos del usuario del body
    if (token && data.user) {
      return {
        success: true,
        data: {
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            image: data.user.image,
            emailVerified: data.user.emailVerified,
            createdAt: data.user.createdAt,
            updatedAt: data.user.updatedAt,
          },
          token: token,
        },
      }
    }

    // Fallback: si el token viene en el body (por si acaso)
    if (data.user && data.token) {
      return {
        success: true,
        data: {
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            image: data.user.image,
            emailVerified: data.user.emailVerified,
            createdAt: data.user.createdAt,
            updatedAt: data.user.updatedAt,
          },
          token: data.token,
        },
      }
    }

    return {
      success: false,
      error: {
        code: data.code || data.error?.code || 'UNKNOWN_ERROR',
        message: data.message || data.error?.message || 'Login failed',
      },
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please try again',
      },
    }
  }
}

/**
 * @deprecated Use '@/lib/services/user.service' instead
 */
export async function getCurrentUserService(jwt: string): Promise<UserResponse> {
  const url = `${process.env.BACKEND_URL}/api/v1/users/me`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: data.error?.code || String(response.status),
          message: data.error?.message || 'Failed to fetch user',
        },
      }
    }

    if (data.success && data.data) {
      return {
        success: true,
        data: {
          id: data.data.id,
          email: data.data.email,
          name: data.data.name,
          image: data.data.image,
          emailVerified: data.data.emailVerified,
          createdAt: data.data.createdAt,
          updatedAt: data.data.updatedAt,
        },
      }
    }

    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to fetch user',
      },
    }
  } catch {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please try again',
      },
    }
  }
}

/**
 * @deprecated Use '@/lib/services/user.service' instead
 */
export async function getUserStatsService(jwt: string): Promise<UserStatsResponse> {
  const url = `${process.env.BACKEND_URL}/api/v1/users/me/stats`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: data.error?.code || String(response.status),
          message: data.error?.message || 'Failed to fetch stats',
        },
      }
    }

    if (data.success && data.data) {
      return {
        success: true,
        data: {
          totalEnrollments: data.data.totalEnrollments,
          totalCompletions: data.data.totalCompletions,
          totalQuizAttempts: data.data.totalQuizAttempts,
          averageQuizScore: data.data.averageQuizScore,
        },
      }
    }

    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to fetch stats',
      },
    }
  } catch {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please try again',
      },
    }
  }
}

/**
 * @deprecated Use '@/lib/services/user.service' instead
 */
export async function getUserProgressService(jwt: string): Promise<UserProgressResponse> {
  const url = `${process.env.BACKEND_URL}/api/v1/users/me/progress`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: data.error?.code || String(response.status),
          message: data.error?.message || 'Failed to fetch progress',
        },
      }
    }

    if (data.success) {
      return {
        success: true,
        data: data.data || [],
      }
    }

    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to fetch progress',
      },
    }
  } catch {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please try again',
      },
    }
  }
}
