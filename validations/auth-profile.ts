import * as v from 'valibot'

export type BaseFormState<T extends Record<string, unknown>> = {
  success?: boolean
  message?: string
  redirectUrl?: string
  data?: Partial<T>
  backendErrors?: {
    code?: string
    message?: string
  }
  issues?: Partial<Record<keyof T, string[]>>
}

const PasswordSchema = v.pipe(
  v.string('Your password must be a string.'),
  v.nonEmpty('Please enter your password.'),
  v.minLength(8, 'Your password must have 8 characters or more.'),
  v.regex(/[0-9]/, 'Your password must include at least one number.'),
  v.regex(/[A-Za-z]/, 'Your password must include at least one letter.'),
)

export const ForgotPasswordFormSchema = v.object({
  email: v.pipe(
    v.string('Your email must be a string.'),
    v.nonEmpty('Please enter your email.'),
    v.email('The email address is badly formatted.'),
  ),
})

export const ResetPasswordFormSchema = v.object({
  token: v.pipe(v.string('Reset token is required.'), v.nonEmpty('Reset token is required.')),
  password: PasswordSchema,
  confirmPassword: v.pipe(
    v.string('Your password confirmation must be a string.'),
    v.nonEmpty('Please confirm your password.'),
  ),
})

export const ChangePasswordFormSchema = v.object({
  currentPassword: v.pipe(
    v.string('Your current password must be a string.'),
    v.nonEmpty('Please enter your current password.'),
  ),
  newPassword: PasswordSchema,
  confirmPassword: v.pipe(
    v.string('Your password confirmation must be a string.'),
    v.nonEmpty('Please confirm your password.'),
  ),
})

export const UpdateUserNameFormSchema = v.object({
  name: v.pipe(
    v.string('Your name must be a string.'),
    v.nonEmpty('Please enter your name.'),
    v.minLength(2, 'Your name must have 2 characters or more.'),
  ),
})

export const DeleteUserFormSchema = v.object({
  password: PasswordSchema,
  confirmDelete: v.optional(v.string()),
})

export type ForgotPasswordFormValues = v.InferOutput<typeof ForgotPasswordFormSchema>
export type ResetPasswordFormValues = v.InferOutput<typeof ResetPasswordFormSchema>
export type ChangePasswordFormValues = v.InferOutput<typeof ChangePasswordFormSchema>
export type UpdateUserNameFormValues = v.InferOutput<typeof UpdateUserNameFormSchema>
export type DeleteUserFormValues = v.InferOutput<typeof DeleteUserFormSchema>

export type ForgotPasswordFormState = BaseFormState<ForgotPasswordFormValues>
export type ResetPasswordFormState = BaseFormState<ResetPasswordFormValues>
export type ChangePasswordFormState = BaseFormState<ChangePasswordFormValues>
export type UpdateUserNameFormState = BaseFormState<UpdateUserNameFormValues>
export type DeleteUserFormState = BaseFormState<DeleteUserFormValues>
