'use server'
import * as v from 'valibot'
import { registerUserService } from '@/lib/api'
import { type FormState, SignupFormSchema } from '@/validations/auth'

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
