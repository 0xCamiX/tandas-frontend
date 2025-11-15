'use client'

import Link from 'next/link'
import { useActionState, useId } from 'react'
import { actions } from '@/app/actions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { FormState } from '@/validations/auth'
import { FormError } from './form-error'

const styles = {
  container: 'w-full max-w-md',
  header: 'space-y-1',
  title: 'text-3xl font-bold',
  content: 'space-y-4',
  fieldGroup: 'space-y-2',
  footer: 'flex flex-col',
  button: 'w-full',
  prompt: 'mt-4 text-center text-sm',
  link: 'ml-2 text-primary hover:underline',
}

const INITIAL_STATE: FormState = {
  success: false,
  message: undefined,
  data: {
    email: undefined,
    password: undefined,
  },
  backendErrors: {
    code: undefined,
    message: undefined,
  },
  issues: {
    email: undefined,
    password: undefined,
  },
}

export function SigninForm() {
  const [state, formAction] = useActionState(actions.auth.loginUserAction, INITIAL_STATE)

  return (
    <div className={styles.container}>
      <form action={formAction}>
        <Card>
          <CardHeader className={styles.header}>
            <CardTitle className={styles.title}>Sign In</CardTitle>
            <CardDescription>Enter your details to sign in to your account</CardDescription>
          </CardHeader>
          <CardContent className={styles.content}>
            <div className={styles.fieldGroup}>
              <Label htmlFor="email">Email</Label>
              <Input
                defaultValue={state.data?.email ?? ''}
                id={useId()}
                name="email"
                placeholder="name@example.com"
                type="email"
              />
              <FormError issues={state.issues?.email} />
            </div>
            <div className={styles.fieldGroup}>
              <Label htmlFor="password">Password</Label>
              <Input
                defaultValue={state.data?.password ?? ''}
                id={useId()}
                name="password"
                placeholder="password"
                type="password"
              />
              <FormError issues={state.issues?.password} />
            </div>
          </CardContent>
          <CardFooter className={styles.footer}>
            <Button className={styles.button}>Sign In</Button>
            {state.backendErrors?.message && (
              <p className="py-2 mt-1 text-xs italic text-red-500">
                {state.backendErrors?.message}
              </p>
            )}
          </CardFooter>
        </Card>
        <div className={styles.prompt}>
          Don&apos;t have an account?
          <Link className={styles.link} href="signup">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  )
}
