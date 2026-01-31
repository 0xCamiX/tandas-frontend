import { apiClient } from '@/lib/api-client'
import { getJWT } from '@/lib/auth'
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

export type AuthServiceResponse<T> =
  | {
      success: true
      data: T
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

export async function requestPasswordResetService(
  email: string,
): Promise<AuthServiceResponse<Record<string, unknown>>> {
  return apiClient.post<Record<string, unknown>>('/api/auth/forget-password', {
    body: {
      email,
    },
    requiresAuth: false,
  })
}

export async function resetPasswordService(
  token: string,
  newPassword: string,
): Promise<AuthServiceResponse<Record<string, unknown>>> {
  return apiClient.post<Record<string, unknown>>('/api/auth/reset-password', {
    body: {
      token,
      newPassword,
    },
    requiresAuth: false,
  })
}

export async function changePasswordService(
  currentPassword: string,
  newPassword: string,
): Promise<AuthServiceResponse<Record<string, unknown>>> {
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

  return apiClient.post<Record<string, unknown>>('/api/auth/change-password', {
    body: {
      currentPassword,
      newPassword,
    },
    requiresAuth: true,
    jwt,
  })
}

export async function updateUserNameService(
  name: string,
): Promise<AuthServiceResponse<Record<string, unknown>>> {
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

  return apiClient.post<Record<string, unknown>>('/api/auth/update-user', {
    body: {
      name,
    },
    requiresAuth: true,
    jwt,
  })
}

export async function deleteUserService(
  password: string,
): Promise<AuthServiceResponse<Record<string, unknown>>> {
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

  return apiClient.post<Record<string, unknown>>('/api/auth/delete-user', {
    body: {
      password,
    },
    requiresAuth: true,
    jwt,
  })
}

export async function setPasswordService(
  newPassword: string,
): Promise<AuthServiceResponse<Record<string, unknown>>> {
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

  return apiClient.post<Record<string, unknown>>('/api/auth/set-password', {
    body: {
      password: newPassword,
    },
    requiresAuth: true,
    jwt,
  })
}
