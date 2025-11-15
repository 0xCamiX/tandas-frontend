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

type Session = {
  id: string
  userId: string
  expiresAt: string
}

type LoginUserSuccess = {
  success: true
  data: {
    user: User
    session: Session
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

export async function loginUserService(userData: object): Promise<LoginUserResponse> {
  const url = `${process.env.BACKEND_URL}/api/auth/sign-in/email`

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
          message: data.message,
        },
      }
    }

    if (data.user && data.session) {
      return {
        success: true,
        data: {
          user: data.user,
          session: data.session,
        },
      }
    }

    return {
      success: false,
      error: {
        code: data.code || 'UNKNOWN_ERROR',
        message: data.message,
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
