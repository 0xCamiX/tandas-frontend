import { apiClient } from '@/lib/api-client'
import { getJWT } from '@/lib/auth'
import type { ModuleCompletion } from '@/lib/types'

export type ModuleCompletionResponse =
  | {
      success: true
      data: ModuleCompletion
    }
  | {
      success: false
      error: {
        code: string
        message: string
      }
    }

export async function completeModuleService(moduleId: string): Promise<ModuleCompletionResponse> {
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

  const endpoint = `/api/v1/module-completions/modules/${moduleId}`

  return apiClient.post<ModuleCompletion>(endpoint, {
    requiresAuth: true,
    jwt,
    body: {},
    cache: 'no-store',
  })
}
