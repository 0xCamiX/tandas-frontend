'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import * as v from 'valibot'
import { loginUserService, registerUserService } from '@/lib/api'
import { type FormState, SigninFormSchema, SignupFormSchema } from '@/validations/auth'

export async function registerUserAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const fields = {
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const validatedFields = v.safeParse(SignupFormSchema, fields)

  if (validatedFields.issues) {
    const flatErrors = v.flatten<typeof SignupFormSchema>(validatedFields.issues)
    return {
      success: false,
      message: 'Validation error',
      issues: {
        username: flatErrors?.nested?.username,
        email: flatErrors?.nested?.email,
        password: flatErrors?.nested?.password,
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

  const userData = {
    username: validatedFields.output.username,
    email: validatedFields.output.email,
    password: validatedFields.output.password,
    callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/signin`,
  }

  const response = await registerUserService(userData)

  if (response.success) {
    return {
      success: true,
      message: 'Registration successful',
      data: {
        ...prevState.data,
        ...fields,
      },
      backendErrors: undefined,
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

export async function loginUserAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const fields = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const validatedFields = v.safeParse(SigninFormSchema, fields)

  if (validatedFields.issues) {
    const flatErrors = v.flatten<typeof SigninFormSchema>(validatedFields.issues)
    return {
      success: false,
      message: 'Validation error',
      issues: {
        email: flatErrors?.nested?.email,
        password: flatErrors?.nested?.password,
      },
      backendErrors: {
        code: '400',
        message: 'Validation error',
      },
      data: {
        ...prevState.data,
        email: fields.email,
        password: fields.password,
      },
    }
  }

  const userData = {
    email: validatedFields.output.email,
    password: validatedFields.output.password,
    callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}`,
  }

  const response = await loginUserService(userData)

  if (response.success) {
    const cookieStore = await cookies()
    cookieStore.set('jwt', response?.data?.token ?? '', {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      httpOnly: true, // Only accessible by the server
      domain: process.env.NEXT_PUBLIC_APP_URL ?? 'localhost',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    redirect('/')
  }

  return {
    success: false,
    message: response.error.message,
    data: {
      ...prevState.data,
      email: fields.email,
    },
    backendErrors: {
      code: response.error.code,
      message: response.error.message,
    },
  }
}
