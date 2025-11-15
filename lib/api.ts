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

export async function registerUserService(userData: object): Promise<RegisterUserResponse> {
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

export async function loginUserService(userData: object): Promise<LoginUserResponse> {
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
