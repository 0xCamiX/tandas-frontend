'use server'

import { enrollCourseService } from '@/lib/services/enrollment.service'

export type EnrollCourseActionResult =
  | {
      success: true
      message: string
      firstModuleId?: string
      alreadyEnrolled?: boolean
    }
  | {
      success: false
      error: string
      errorCode?: string
    }

export async function enrollCourseAction(
  courseId: string,
  firstModuleId?: string,
): Promise<EnrollCourseActionResult> {
  try {
    const response = await enrollCourseService(courseId)

    if (!response.success) {
      if (response.error.code === 'ALREADY_ENROLLED') {
        return {
          success: false,
          error: response.error.message || 'Ya estás inscrito en este curso',
          errorCode: 'ALREADY_ENROLLED',
        }
      }

      return {
        success: false,
        error: response.error.message || 'Error al inscribirse al curso',
        errorCode: response.error.code,
      }
    }

    // Si es exitoso, retornar información para que el cliente redirija
    return {
      success: true,
      message: response.message || 'Inscripción realizada exitosamente',
      firstModuleId,
    }
  } catch (error) {
    console.error('Error en enrollCourseAction:', error)
    return {
      success: false,
      error: 'Error inesperado al inscribirse al curso',
    }
  }
}
