'use client'

import { Eye, EyeOff, Lock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useId, useState } from 'react'
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
import type { ResetPasswordFormState } from '@/validations/auth-profile'
import { FormError } from './form-error'
import { SubmitButton } from './submit-button'

const INITIAL_STATE: ResetPasswordFormState = {
  success: false,
  message: undefined,
  data: {
    token: undefined,
    password: undefined,
    confirmPassword: undefined,
  },
  backendErrors: {
    code: undefined,
    message: undefined,
  },
  issues: {
    token: undefined,
    password: undefined,
    confirmPassword: undefined,
  },
}

type ResetPasswordFormProps = {
  token?: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, formAction] = useActionState(actions.auth.resetPasswordAction, INITIAL_STATE)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const passwordId = useId()
  const confirmId = useId()

  useEffect(() => {
    if (state.success && state.redirectUrl) {
      router.push(state.redirectUrl)
    }
  }, [
    state.redirectUrl,
    state.success,
    router,
  ])

  const statusTone = state.success ? 'text-emerald-600' : 'text-red-600'

  if (!token) {
    return (
      <div className="w-full max-w-md">
        <Card className="shadow-lg shadow-black/5 dark:shadow-black/20 border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Restablecer contraseña
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              El enlace de recuperación no es válido o ha expirado.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-3 pt-2">
            <Button asChild className="w-full" variant="ghost">
              <Link href="/forgot-password">Solicitar un nuevo enlace</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <form action={formAction}>
        <input name="token" type="hidden" value={token} />
        <Card className="shadow-lg shadow-black/5 dark:shadow-black/20 border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold tracking-tight">Nueva contraseña</CardTitle>
            <CardDescription className="text-muted-foreground">
              Elige una nueva contraseña segura para tu cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium" htmlFor={passwordId}>
                Nueva contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-10 pr-10"
                  defaultValue={state.data?.password ?? ''}
                  id={passwordId}
                  name="password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                />
                <Button
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">
                    {showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  </span>
                </Button>
              </div>
              <FormError issues={state.issues?.password} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium" htmlFor={confirmId}>
                Confirmar contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-10 pr-10"
                  defaultValue={state.data?.confirmPassword ?? ''}
                  id={confirmId}
                  name="confirmPassword"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                />
              </div>
              <FormError issues={state.issues?.confirmPassword} />
            </div>
            {state.message && (
              <p className={cn('text-sm', statusTone)} role={state.success ? 'status' : 'alert'}>
                {state.message}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3 pt-2">
            <SubmitButton className="w-full">Actualizar contraseña</SubmitButton>
            <Button asChild className="w-full" type="button" variant="ghost">
              <Link href="/signin">Volver a iniciar sesión</Link>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
