type ApiResponse<T> =
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

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: unknown
  requiresAuth?: boolean
  jwt?: string | null
}

export class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.BACKEND_URL || ''
    if (!this.baseUrl) {
      throw new Error('BACKEND_URL environment variable is not set')
    }
  }

  private async getAuthHeaders(jwt: string | null | undefined): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (jwt) {
      headers.Authorization = `Bearer ${jwt}`
    }

    return headers
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const { method = 'GET', headers = {}, body, requiresAuth = false, jwt } = options

    try {
      const url = `${this.baseUrl}${endpoint}`
      const authHeaders = requiresAuth ? await this.getAuthHeaders(jwt) : {}

      const response = await fetch(url, {
        method,
        headers: {
          ...authHeaders,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include',
        cache: 'no-store',
      })

      // Leer headers antes de parsear JSON
      const tokenHeader = response.headers.get('set-auth-token')
      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.error?.code || data.code || String(response.status),
            message: data.error?.message || data.message || 'Request failed',
          },
        }
      }

      if (data.success === false) {
        return {
          success: false,
          error: {
            code: data.error?.code || 'UNKNOWN_ERROR',
            message: data.error?.message || 'Request failed',
          },
        }
      }

      // Si hay un token en el header, agregarlo a la respuesta
      // El backend puede retornar { user: {...}, token: "..." } o { data: { user: {...}, token: "..." } }
      const responseData = data.data || data

      if (tokenHeader && typeof responseData === 'object' && responseData !== null) {
        ;(
          responseData as {
            token?: string
          }
        ).token = tokenHeader
      }

      return {
        success: true,
        data: responseData,
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

  async get<T>(
    endpoint: string,
    options: Omit<RequestOptions, 'method'> = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    })
  }

  async post<T>(
    endpoint: string,
    options: Omit<RequestOptions, 'method'> = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
    })
  }

  async put<T>(
    endpoint: string,
    options: Omit<RequestOptions, 'method'> = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
    })
  }

  async delete<T>(
    endpoint: string,
    options: Omit<RequestOptions, 'method'> = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient()
