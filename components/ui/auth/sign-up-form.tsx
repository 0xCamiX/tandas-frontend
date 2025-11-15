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
  link: 'ml-2',
}

const INITIAL_STATE: FormState = {
  success: false,
  message: undefined,
  data: {
    username: undefined,
    email: undefined,
    password: undefined,
  },
  backendErrors: {
    code: undefined,
    message: undefined,
  },
  issues: {
    username: undefined,
    email: undefined,
    password: undefined,
  },
}

export function SignupForm() {
  const [state, formAction] = useActionState(actions.auth.registerUserAction, INITIAL_STATE)

  return (
    <div className={styles.container}>
      <form action={formAction}>
        <Card>
          <CardHeader className={styles.header}>
            <CardTitle className={styles.title}>Sign Up</CardTitle>
            <CardDescription>Enter your details to create a new account</CardDescription>
          </CardHeader>
          <CardContent className={styles.content}>
            <div className={styles.fieldGroup}>
              <Label htmlFor="username">Username</Label>
              <Input
                defaultValue={state.data?.username ?? ''}
                id={useId()}
                name="username"
                placeholder="username"
                type="text"
              />
              <FormError issues={state.issues?.username} />
            </div>
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
            <Button className={styles.button}>Sign Up</Button>
            {state.backendErrors?.message && (
              <p className="py-2 mt-1 text-xs italic text-red-500">
                {state.backendErrors?.message}
              </p>
            )}
          </CardFooter>
        </Card>
        <div className={styles.prompt}>
          Have an account?
          <Link className={styles.link} href="signin">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  )
}
