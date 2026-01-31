'use client'

import { Lock, Trash2, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useId, useState } from 'react'
import { actions } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type {
  ChangePasswordFormState,
  DeleteUserFormState,
  UpdateUserNameFormState,
} from '@/validations/auth-profile'
import { FormError } from '@/components/ui/auth/form-error'
import { SubmitButton } from '@/components/ui/auth/submit-button'

const UPDATE_NAME_INITIAL: UpdateUserNameFormState = {
  success: false,
  message: undefined,
  data: {
    name: undefined,
  },
  backendErrors: {
    code: undefined,
    message: undefined,
  },
  issues: {
    name: undefined,
  },
}

const CHANGE_PASSWORD_INITIAL: ChangePasswordFormState = {
  success: false,
  message: undefined,
  data: {
    currentPassword: undefined,
    newPassword: undefined,
    confirmPassword: undefined,
  },
  backendErrors: {
    code: undefined,
    message: undefined,
  },
  issues: {
    currentPassword: undefined,
    newPassword: undefined,
    confirmPassword: undefined,
  },
}

const DELETE_USER_INITIAL: DeleteUserFormState = {
  success: false,
  message: undefined,
  data: {
    password: undefined,
    confirmDelete: undefined,
  },
  backendErrors: {
    code: undefined,
    message: undefined,
  },
  issues: {
    password: undefined,
    confirmDelete: undefined,
  },
}

type ProfileManagementProps = {
  initialName: string | null
}

export function ProfileManagement({ initialName }: ProfileManagementProps) {
  const [nameState, nameAction] = useActionState(actions.auth.updateUserNameAction, {
    ...UPDATE_NAME_INITIAL,
    data: {
      name: initialName || '',
    },
  })
  const [passwordState, passwordAction] = useActionState(
    actions.auth.changePasswordAction,
    CHANGE_PASSWORD_INITIAL,
  )
  const [deleteState, deleteAction] = useActionState(
    actions.auth.deleteUserAction,
    DELETE_USER_INITIAL,
  )
  const [showPasswords, setShowPasswords] = useState(false)
  const router = useRouter()
  const nameId = useId()
  const currentPasswordId = useId()
  const newPasswordId = useId()
  const confirmPasswordId = useId()
  const deletePasswordId = useId()
  const deleteConfirmId = useId()

  useEffect(() => {
    if (nameState.success) {
      router.refresh()
    }
  }, [
    nameState.success,
    router,
  ])

  useEffect(() => {
    if (deleteState.success && deleteState.redirectUrl) {
      router.push(deleteState.redirectUrl)
    }
  }, [
    deleteState.success,
    deleteState.redirectUrl,
    router,
  ])

  const nameStatusTone = nameState.success ? 'text-emerald-600' : 'text-red-600'
  const passwordStatusTone = passwordState.success ? 'text-emerald-600' : 'text-red-600'
  const deleteStatusTone = deleteState.success ? 'text-emerald-600' : 'text-red-600'

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">Datos de la cuenta</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form action={nameAction} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium" htmlFor={nameId}>
                Nombre
              </Label>
              <Input
                defaultValue={nameState.data?.name ?? ''}
                id={nameId}
                name="name"
                placeholder="Tu nombre"
                type="text"
              />
              <FormError issues={nameState.issues?.name} />
            </div>
            {nameState.message && (
              <p
                className={cn('text-sm', nameStatusTone)}
                role={nameState.success ? 'status' : 'alert'}
              >
                {nameState.message}
              </p>
            )}
            <SubmitButton>Guardar cambios</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-semibold">Seguridad</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form action={passwordAction} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium" htmlFor={currentPasswordId}>
                Contraseña actual
              </Label>
              <Input
                defaultValue={passwordState.data?.currentPassword ?? ''}
                id={currentPasswordId}
                name="currentPassword"
                placeholder="••••••••"
                type={showPasswords ? 'text' : 'password'}
              />
              <FormError issues={passwordState.issues?.currentPassword} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium" htmlFor={newPasswordId}>
                Nueva contraseña
              </Label>
              <Input
                defaultValue={passwordState.data?.newPassword ?? ''}
                id={newPasswordId}
                name="newPassword"
                placeholder="••••••••"
                type={showPasswords ? 'text' : 'password'}
              />
              <FormError issues={passwordState.issues?.newPassword} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium" htmlFor={confirmPasswordId}>
                Confirmar contraseña
              </Label>
              <Input
                defaultValue={passwordState.data?.confirmPassword ?? ''}
                id={confirmPasswordId}
                name="confirmPassword"
                placeholder="••••••••"
                type={showPasswords ? 'text' : 'password'}
              />
              <FormError issues={passwordState.issues?.confirmPassword} />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground" htmlFor="show-passwords">
                <input
                  checked={showPasswords}
                  id="show-passwords"
                  onChange={() => setShowPasswords(!showPasswords)}
                  type="checkbox"
                />
                Mostrar contraseñas
              </label>
            </div>
            {passwordState.message && (
              <p
                className={cn('text-sm', passwordStatusTone)}
                role={passwordState.success ? 'status' : 'alert'}
              >
                {passwordState.message}
              </p>
            )}
            <SubmitButton>Actualizar contraseña</SubmitButton>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Trash2 className="h-5 w-5 text-red-500" />
            <CardTitle className="text-xl font-semibold">Eliminar cuenta</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form action={deleteAction} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium" htmlFor={deletePasswordId}>
                Confirma con tu contraseña
              </Label>
              <Input
                defaultValue={deleteState.data?.password ?? ''}
                id={deletePasswordId}
                name="password"
                placeholder="••••••••"
                type="password"
              />
              <FormError issues={deleteState.issues?.password} />
            </div>
            <div className="flex items-start gap-2">
              <input
                className="mt-1"
                id={deleteConfirmId}
                name="confirmDelete"
                type="checkbox"
              />
              <Label className="text-sm font-medium leading-snug" htmlFor={deleteConfirmId}>
                Entiendo que esta acción es permanente y eliminará mi cuenta.
              </Label>
            </div>
            <FormError issues={deleteState.issues?.confirmDelete} />
            {deleteState.message && (
              <p
                className={cn('text-sm', deleteStatusTone)}
                role={deleteState.success ? 'status' : 'alert'}
              >
                {deleteState.message}
              </p>
            )}
            <Button className="w-full" type="submit" variant="destructive">
              Eliminar cuenta
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
