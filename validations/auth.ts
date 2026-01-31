import * as v from 'valibot'

const PasswordSchema = v.pipe(
  v.string('Your password must be a string.'),
  v.nonEmpty('Please enter your password.'),
  v.minLength(8, 'Your password must have 8 characters or more.'),
  v.regex(/[0-9]/, 'Your password must include at least one number.'),
  v.regex(/[A-Za-z]/, 'Your password must include at least one letter.'),
)

export const SigninFormSchema = v.object({
  email: v.pipe(
    v.string('Your email must be a string.'),
    v.nonEmpty('Please enter your email.'),
    v.email('The email address is badly formatted.'),
  ),
  password: v.pipe(
    v.string('Your password must be a string.'),
    v.nonEmpty('Please enter your password.'),
    v.minLength(8, 'Your password must have 8 characters or more.'),
  ),
})

export const SignupFormSchema = v.object({
  email: v.pipe(
    v.string('Your email must be a string.'),
    v.nonEmpty('Please enter your email.'),
    v.email('The email address is badly formatted.'),
  ),
  password: PasswordSchema,
})

export type SigninFormValues = v.InferOutput<typeof SigninFormSchema>
export type SignupFormValues = v.InferOutput<typeof SignupFormSchema>

export type FormState = {
  success?: boolean
  message?: string
  redirectUrl?: string
  data?: {
    email?: string
    password?: string
  }
  backendErrors?: {
    code?: string
    message?: string
  }
  issues?: {
    email?: string[]
    password?: string[]
  }
}
