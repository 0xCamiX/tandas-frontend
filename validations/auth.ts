import * as v from 'valibot'

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
  username: v.pipe(
    v.string('Your username must be a string.'),
    v.nonEmpty('Please enter your username.'),
    v.minLength(3, 'Your username must have 3 characters or more.'),
  ),
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

export type SigninFormValues = v.InferOutput<typeof SigninFormSchema>
export type SignupFormValues = v.InferOutput<typeof SignupFormSchema>

export type FormState = {
  success?: boolean
  message?: string
  redirectUrl?: string
  data?: {
    username?: string
    email?: string
    password?: string
  }
  backendErrors?: {
    code?: string
    message?: string
  }
  issues?: {
    username?: string[]
    email?: string[]
    password?: string[]
  }
}
