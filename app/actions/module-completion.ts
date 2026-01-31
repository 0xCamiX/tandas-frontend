'use server'

import { completeModuleService } from '@/lib/services/module-completion.service'

export type CompleteModuleActionResult =
  | {
      success: true
      message: string
      alreadyCompleted?: boolean
    }
  | {
      success: false
      error: string
      errorCode?: string
    }

export async function completeModuleAction(moduleId: string): Promise<CompleteModuleActionResult> {
  try {
    const response = await completeModuleService(moduleId)

    if (!response.success) {
      if (response.error.code === 'ALREADY_COMPLETED') {
        return {
          success: true,
          message: response.error.message || 'Este módulo ya estaba marcado como completado.',
          alreadyCompleted: true,
        }
      }

      return {
        success: false,
        error: response.error.message || 'Error al completar el módulo',
        errorCode: response.error.code,
      }
    }

    return {
      success: true,
      message: '¡Módulo completado! Tu progreso ha sido actualizado.',
    }
  } catch (error) {
    console.error('Error en completeModuleAction:', error)
    return {
      success: false,
      error: 'Error inesperado al completar el módulo',
    }
  }
}
