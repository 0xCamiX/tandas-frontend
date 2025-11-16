import { User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { User as UserType } from '@/lib/types'

type AccountInfoProps = {
  user: UserType
}

export function AccountInfo({ user }: AccountInfoProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-semibold">Información de la Cuenta</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-border/50">
            <p className="text-sm text-muted-foreground font-medium">Email</p>
            <p className="text-foreground font-mono text-right">{user.email}</p>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border/50">
            <p className="text-sm text-muted-foreground font-medium">Email Verificado</p>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${user.emailVerified ? 'bg-green-500' : 'bg-yellow-500'}`}
              />
              <p className="text-foreground">
                {user.emailVerified ? 'Verificado' : 'No verificado'}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border/50">
            <p className="text-sm text-muted-foreground font-medium">Fecha de Registro</p>
            <p className="text-foreground">
              {new Date(user.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex justify-between items-start py-3">
            <p className="text-sm text-muted-foreground font-medium">ID</p>
            <p className="text-foreground font-mono text-sm text-right max-w-md break-all">
              {user.id}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
