type User = {
  id: string
  email: string
  name: string | null
  image: string | null
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

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

export async function registerUserService(userData: object): Promise<RegisterUserResponse> {
  const url = `${process.env.BACKEND_URL}/api/auth/sign-up/email`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: data.code || String(response.status),
          message: data.message || 'Registration failed',
        },
      }
    }

    if (data.token && data.user) {
      return {
        success: true,
        data: {
          token: data.token,
          user: data.user,
        },
      }
    }

    return {
      success: false,
      error: {
        code: data.code || 'UNKNOWN_ERROR',
        message: data.message || 'Registration failed',
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
