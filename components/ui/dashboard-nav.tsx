'use client'

import { LogOut, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/app/actions/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Icon from '@/components/ui/icons/icon'
import { siteConfig } from '@/config/site'
import type { User as UserType } from '@/lib/types'
import { cn } from '@/lib/utils'

type DashboardNavProps = {
  user: UserType | null
}

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname()

  const handleLogout = async () => {
    await logoutAction()
  }

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return email[0].toUpperCase()
  }

  const userName = user?.name || 'Usuario'
  const userEmail = user?.email || 'usuario@ejemplo.com'
  const userImage = user?.image || null

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link className="flex items-center gap-2 hover:opacity-80 transition-opacity" href="/">
          <Icon className="text-primary" height="4" width="4" />
          <h1 className="bg-gradient-to-b from-primary to-primary-foreground bg-clip-text text-2xl font-bold text-transparent">
            TANDAS
          </h1>
        </Link>
        <nav className="flex gap-2">
          {siteConfig.mainNav.map(item => {
            const isActive = pathname === item.href
            return (
              <Link href={item.href} key={item.title}>
                <Button
                  className={cn(
                    'bg-transparent hover:bg-transparent hover:text-foreground border-0 rounded-none border-b-2 transition-colors',
                    isActive
                      ? 'border-black text-foreground'
                      : 'border-transparent text-muted-foreground',
                  )}
                  variant="ghost"
                >
                  {item.title}
                </Button>
              </Link>
            )
          })}
        </nav>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              type="button"
            >
              <Avatar className="size-10">
                <AvatarImage alt={userName} src={userImage || undefined} />
                <AvatarFallback>{getInitials(user?.name || null, userEmail)}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link className="flex items-center cursor-pointer" href="/dashboard/">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={handleLogout}
              variant="destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
