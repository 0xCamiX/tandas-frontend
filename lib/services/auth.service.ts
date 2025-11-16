import { apiClient } from '@/lib/api-client'
import type { LoginUserData, RegisterUserData, User } from '@/lib/types'

export type RegisterResponse =
  | {
      success: true
      data: {
        token: string
        user: User
      }
    }
  | {
      success: false
      error: {
        code: string
        message: string
      }
    }

export type LoginResponse =
  | {
      success: true
      data: {
        user: User
        token: string
      }
    }
  | {
      success: false
      error: {
        code: string
        message: string
      }
    }

export async function registerUserService(userData: RegisterUserData): Promise<RegisterResponse> {
  const response = await apiClient.post<{
    token?: string
    user?: User
    redirect?: boolean
  }>('/api/auth/sign-up/email', {
    body: userData,
    requiresAuth: false,
  })

  if (response.success) {
    // El token puede venir del header set-auth-token (agregado por api-client) o del body
    const data = response.data as {
      token?: string
      user?: User
      redirect?: boolean
    }
    const token = data.token
    const user = data.user

    if (token && user && 'id' in user) {
      return {
        success: true,
        data: {
          token,
          user: user as User,
        },
      }
    }
  }

  return response as RegisterResponse
}

export async function loginUserService(userData: LoginUserData): Promise<LoginResponse> {
  const response = await apiClient.post<{
    token?: string
    user?: User
    redirect?: boolean
  }>('/api/auth/sign-in/email', {
    body: userData,
    requiresAuth: false,
  })

  if (response.success) {
    // El token puede venir del header set-auth-token (agregado por api-client) o del body
    const data = response.data as {
      token?: string
      user?: User
      redirect?: boolean
    }
    const token = data.token
    const user = data.user

    if (token && user && 'id' in user) {
      return {
        success: true,
        data: {
          token,
          user: user as User,
        },
      }
    }
  }

  return response as LoginResponse
}
