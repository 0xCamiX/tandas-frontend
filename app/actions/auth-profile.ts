'use server'

import { cookies } from 'next/headers'
import { updateTag } from 'next/cache'
import * as v from 'valibot'
import {
  changePasswordService,
  deleteUserService,
  requestPasswordResetService,
  resetPasswordService,
  setPasswordService,
  updateUserNameService,
} from '@/lib/services/auth.service'
import type {
  ChangePasswordFormState,
  DeleteUserFormState,
  ForgotPasswordFormState,
  ResetPasswordFormState,
  UpdateUserNameFormState,
} from '@/validations/auth-profile'
import {
  ChangePasswordFormSchema,
  DeleteUserFormSchema,
  ForgotPasswordFormSchema,
  ResetPasswordFormSchema,
  UpdateUserNameFormSchema,
} from '@/validations/auth-profile'

function getCookieConfig() {
  const isProduction = process.env.NODE_ENV === 'production'
  const appUrl = process.env.NEXT_PUBLIC_URL

  let domain: string | undefined
  if (appUrl && isProduction) {
    try {
      const url = new URL(appUrl)
      domain = url.hostname
    } catch {
      domain = undefined
    }
  }

  return {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    ...(domain && domain !== 'localhost'
      ? {
          domain,
        }
      : {}),
  }
}

function extractToken(data: Record<string, unknown>): string | null {
  if ('token' in data && typeof data.token === 'string') {
    return data.token
  }
  return null
}

export async function forgotPasswordAction(
  prevState: ForgotPasswordFormState,
  formData: FormData,
): Promise<ForgotPasswordFormState> {
  const fields = {
    email: formData.get('email') as string,
  }

  const validatedFields = v.safeParse(ForgotPasswordFormSchema, fields)

  if (validatedFields.issues) {
    const flatErrors = v.flatten<typeof ForgotPasswordFormSchema>(validatedFields.issues)
    return {
      success: false,
      message: 'Validation error',
      issues: {
        email: flatErrors?.nested?.email,
      },
      backendErrors: {
        code: '400',
        message: 'Validation error',
      },
      data: {
        ...prevState.data,
        ...fields,
      },
    }
  }

  const response = await requestPasswordResetService(validatedFields.output.email)
  const genericMessage = 'Si el email existe, recibirás un enlace para restablecer tu contraseña.'

  if (response.success) {
    return {
      success: true,
      message: genericMessage,
      data: {
        ...prevState.data,
        ...fields,
      },
      backendErrors: undefined,
      issues: undefined,
    }
  }

  return {
    success: true,
    message: genericMessage,
    data: {
      ...prevState.data,
      ...fields,
    },
    backendErrors: undefined,
    issues: undefined,
  }
}

export async function resetPasswordAction(
  prevState: ResetPasswordFormState,
  formData: FormData,
): Promise<ResetPasswordFormState> {
  const fields = {
    token: formData.get('token') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  const validatedFields = v.safeParse(ResetPasswordFormSchema, fields)

  if (validatedFields.issues) {
    const flatErrors = v.flatten<typeof ResetPasswordFormSchema>(validatedFields.issues)
    return {
      success: false,
      message: 'Validation error',
      issues: {
        token: flatErrors?.nested?.token,
        password: flatErrors?.nested?.password,
        confirmPassword: flatErrors?.nested?.confirmPassword,
      },
      backendErrors: {
        code: '400',
        message: 'Validation error',
      },
      data: {
        ...prevState.data,
        ...fields,
      },
    }
  }

  if (fields.password !== fields.confirmPassword) {
    return {
      success: false,
      message: 'Validation error',
      issues: {
        confirmPassword: [
          'Passwords do not match.',
        ],
      },
      backendErrors: {
        code: '400',
        message: 'Passwords do not match.',
      },
      data: {
        ...prevState.data,
        ...fields,
      },
    }
  }

  const response = await resetPasswordService(fields.token, fields.password)

  if (response.success) {
    const cookieStore = await cookies()
    const token = extractToken(response.data)
    if (token) {
      cookieStore.set('jwt', token, getCookieConfig())
    }

    return {
      success: true,
      message: 'Password updated successfully',
      redirectUrl: '/signin',
      data: {
        token: fields.token,
      },
      backendErrors: undefined,
      issues: undefined,
    }
  }

  return {
    success: false,
    message: response.error.message,
    data: {
      ...prevState.data,
      token: fields.token,
    },
    backendErrors: {
      code: response.error.code,
      message: response.error.message,
    },
  }
}

export async function changePasswordAction(
  prevState: ChangePasswordFormState,
  formData: FormData,
): Promise<ChangePasswordFormState> {
  const fields = {
    currentPassword: formData.get('currentPassword') as string,
    newPassword: formData.get('newPassword') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  const validatedFields = v.safeParse(ChangePasswordFormSchema, fields)

  if (validatedFields.issues) {
    const flatErrors = v.flatten<typeof ChangePasswordFormSchema>(validatedFields.issues)
    return {
      success: false,
      message: 'Validation error',
      issues: {
        currentPassword: flatErrors?.nested?.currentPassword,
        newPassword: flatErrors?.nested?.newPassword,
        confirmPassword: flatErrors?.nested?.confirmPassword,
      },
      backendErrors: {
        code: '400',
        message: 'Validation error',
      },
      data: {
        ...prevState.data,
        ...fields,
      },
    }
  }

  if (fields.newPassword !== fields.confirmPassword) {
    return {
      success: false,
      message: 'Validation error',
      issues: {
        confirmPassword: [
          'Passwords do not match.',
        ],
      },
      backendErrors: {
        code: '400',
        message: 'Passwords do not match.',
      },
      data: {
        ...prevState.data,
        ...fields,
      },
    }
  }

  const response = await changePasswordService(fields.currentPassword, fields.newPassword)

  if (response.success) {
    const cookieStore = await cookies()
    const token = extractToken(response.data)
    if (token) {
      cookieStore.set('jwt', token, getCookieConfig())
    }

    return {
      success: true,
      message: 'Contraseña actualizada correctamente.',
      data: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      backendErrors: undefined,
      issues: undefined,
    }
  }

  return {
    success: false,
    message: response.error.message,
    data: {
      ...prevState.data,
      currentPassword: fields.currentPassword,
    },
    backendErrors: {
      code: response.error.code,
      message: response.error.message,
    },
  }
}

export async function updateUserNameAction(
  prevState: UpdateUserNameFormState,
  formData: FormData,
): Promise<UpdateUserNameFormState> {
  const fields = {
    name: formData.get('name') as string,
  }

  const validatedFields = v.safeParse(UpdateUserNameFormSchema, fields)

  if (validatedFields.issues) {
    const flatErrors = v.flatten<typeof UpdateUserNameFormSchema>(validatedFields.issues)
    return {
      success: false,
      message: 'Validation error',
      issues: {
        name: flatErrors?.nested?.name,
      },
      backendErrors: {
        code: '400',
        message: 'Validation error',
      },
      data: {
        ...prevState.data,
        ...fields,
      },
    }
  }

  const response = await updateUserNameService(validatedFields.output.name)

  if (response.success) {
    const cookieStore = await cookies()
    const token = extractToken(response.data)
    if (token) {
      cookieStore.set('jwt', token, getCookieConfig())
    }

    updateTag('user-profile')

    return {
      success: true,
      message: 'Nombre actualizado correctamente.',
      data: {
        name: validatedFields.output.name,
      },
      backendErrors: undefined,
      issues: undefined,
    }
  }

  return {
    success: false,
    message: response.error.message,
    data: {
      ...prevState.data,
      ...fields,
    },
    backendErrors: {
      code: response.error.code,
      message: response.error.message,
    },
  }
}

export async function deleteUserAction(
  prevState: DeleteUserFormState,
  formData: FormData,
): Promise<DeleteUserFormState> {
  const confirmDeleteValue = formData.get('confirmDelete')
  const fields = {
    password: formData.get('password') as string,
    confirmDelete: confirmDeleteValue === null ? undefined : String(confirmDeleteValue),
  }

  const validatedFields = v.safeParse(DeleteUserFormSchema, fields)

  if (validatedFields.issues) {
    const flatErrors = v.flatten<typeof DeleteUserFormSchema>(validatedFields.issues)
    return {
      success: false,
      message: 'Validation error',
      issues: {
        password: flatErrors?.nested?.password,
        confirmDelete: flatErrors?.nested?.confirmDelete,
      },
      backendErrors: {
        code: '400',
        message: 'Validation error',
      },
      data: {
        ...prevState.data,
        ...fields,
      },
    }
  }

  if (fields.confirmDelete !== 'on') {
    return {
      success: false,
      message: 'Validation error',
      issues: {
        confirmDelete: [
          'Please confirm account deletion.',
        ],
      },
      backendErrors: {
        code: '400',
        message: 'Please confirm account deletion.',
      },
      data: {
        ...prevState.data,
        ...fields,
      },
    }
  }

  const response = await deleteUserService(fields.password)

  if (response.success) {
    const cookieStore = await cookies()
    cookieStore.delete('jwt')

    return {
      success: true,
      message: 'Cuenta eliminada correctamente.',
      redirectUrl: '/',
      data: {
        password: '',
        confirmDelete: '',
      },
      backendErrors: undefined,
      issues: undefined,
    }
  }

  return {
    success: false,
    message: response.error.message,
    data: {
      ...prevState.data,
      password: fields.password,
      confirmDelete: fields.confirmDelete,
    },
    backendErrors: {
      code: response.error.code,
      message: response.error.message,
    },
  }
}

export async function setPasswordAction(
  prevState: ChangePasswordFormState,
  formData: FormData,
): Promise<ChangePasswordFormState> {
  const fields = {
    currentPassword: '',
    newPassword: formData.get('newPassword') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  const validatedFields = v.safeParse(ChangePasswordFormSchema, {
    currentPassword: 'placeholder',
    newPassword: fields.newPassword,
    confirmPassword: fields.confirmPassword,
  })

  if (validatedFields.issues) {
    const flatErrors = v.flatten<typeof ChangePasswordFormSchema>(validatedFields.issues)
    return {
      success: false,
      message: 'Validation error',
      issues: {
        newPassword: flatErrors?.nested?.newPassword,
        confirmPassword: flatErrors?.nested?.confirmPassword,
      },
      backendErrors: {
        code: '400',
        message: 'Validation error',
      },
      data: {
        ...prevState.data,
        ...fields,
      },
    }
  }

  if (fields.newPassword !== fields.confirmPassword) {
    return {
      success: false,
      message: 'Validation error',
      issues: {
        confirmPassword: [
          'Passwords do not match.',
        ],
      },
      backendErrors: {
        code: '400',
        message: 'Passwords do not match.',
      },
      data: {
        ...prevState.data,
        ...fields,
      },
    }
  }

  const response = await setPasswordService(fields.newPassword)

  if (response.success) {
    const cookieStore = await cookies()
    const token = extractToken(response.data)
    if (token) {
      cookieStore.set('jwt', token, getCookieConfig())
    }

    return {
      success: true,
      message: 'Contraseña establecida correctamente.',
      data: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      backendErrors: undefined,
      issues: undefined,
    }
  }

  return {
    success: false,
    message: response.error.message,
    data: {
      ...prevState.data,
      ...fields,
    },
    backendErrors: {
      code: response.error.code,
      message: response.error.message,
    },
  }
}
