'use client'

import { Mail } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import type { ForgotPasswordFormState } from '@/validations/auth-profile'
import { FormError } from './form-error'
import { SubmitButton } from './submit-button'

const INITIAL_STATE: ForgotPasswordFormState = {
  success: false,
  message: undefined,
  data: {
    email: undefined,
  },
  backendErrors: {
    code: undefined,
    message: undefined,
  },
  issues: {
    email: undefined,
  },
}

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(actions.auth.forgotPasswordAction, INITIAL_STATE)
  const emailId = useId()

  const statusTone = state.success ? 'text-emerald-600' : 'text-red-600'

  return (
    <div className="w-full max-w-md">
      <form action={formAction}>
        <Card className="shadow-lg shadow-black/5 dark:shadow-black/20 border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Recuperar contraseña
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Te enviaremos un enlace para restablecer tu contraseña.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium" htmlFor={emailId}>
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-10"
                  defaultValue={state.data?.email ?? ''}
                  id={emailId}
                  name="email"
                  placeholder="ejemplo@correo.com"
                  type="email"
                />
              </div>
              <FormError issues={state.issues?.email} />
            </div>
            {state.message && (
              <p
                className={cn('text-sm', statusTone)}
                role={state.success ? 'status' : 'alert'}
              >
                {state.message}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3 pt-2">
            <SubmitButton className="w-full">Enviar enlace</SubmitButton>
            <Button asChild className="w-full" type="button" variant="ghost">
              <Link href="/signin">Volver a iniciar sesión</Link>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
