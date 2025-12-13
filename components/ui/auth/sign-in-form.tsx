'use client'

import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useId, useRef, useState } from 'react'
import { toast } from 'sonner'
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
import { SubmitButton } from './submit-button'

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

type SigninFormProps = {
  callbackUrl?: string
}

export function SigninForm({ callbackUrl }: SigninFormProps) {
  const [state, formAction] = useActionState(actions.auth.loginUserAction, INITIAL_STATE)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const emailId = useId()
  const passwordId = useId()
  const lastErrorRef = useRef<string | null>(null)

  // Handle successful login redirect
  useEffect(() => {
    if (state.success && state.redirectUrl) {
      router.push(state.redirectUrl)
    }
  }, [
    state.success,
    state.redirectUrl,
    router,
  ])

  // Show toast for backend errors (prevent duplicates in Strict Mode)
  useEffect(() => {
    const errorMessage = state.backendErrors?.message
    if (errorMessage && lastErrorRef.current !== errorMessage) {
      lastErrorRef.current = errorMessage
      toast.error('Error de autenticación', {
        description: errorMessage,
        duration: 5000,
      })
    }
  }, [
    state.backendErrors?.message,
  ])

  return (
    <div className="w-full max-w-md">
      <form action={formAction}>
        {callbackUrl && <input name="callbackUrl" type="hidden" value={callbackUrl} />}
        <Card className="shadow-lg shadow-black/5 dark:shadow-black/20 border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold tracking-tight">Iniciar Sesión</CardTitle>
            <CardDescription className="text-muted-foreground">
              Ingresa tus credenciales para acceder a tu cuenta
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
            <div className="space-y-2">
              <Label className="text-sm font-medium" htmlFor={passwordId}>
                Contraseña
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
          </CardContent>
          <CardFooter className="flex flex-col pt-2">
            <SubmitButton className="w-full">Iniciar Sesión</SubmitButton>
          </CardFooter>
        </Card>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿No tienes una cuenta?{' '}
          <Link
            className="font-medium text-primary hover:underline underline-offset-4 transition-colors"
            href="/signup"
          >
            Registrarse
          </Link>
        </p>
      </form>
    </div>
  )
}
