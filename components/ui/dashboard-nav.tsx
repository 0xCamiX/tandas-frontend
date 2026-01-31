'use client'

import { LogOut, Menu, User, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { siteConfig } from '@/config/site'
import type { User as UserType } from '@/lib/types'
import { cn } from '@/lib/utils'

type DashboardNavProps = {
  user: UserType | null
}

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

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
          <h1 className="bg-linear-to-b from-primary to-primary-foreground bg-clip-text text-2xl font-bold text-transparent">
            YAKU
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-2">
          {siteConfig.mainNav.map(item => {
            const isActive = pathname === item.href
            return (
              <Link href={item.href} key={item.title}>
                <Button
                  className={cn(
                    'bg-transparent hover:bg-transparent hover:text-foreground border-0 rounded-none border-b-2 transition-colors',
                    isActive
                      ? 'border-foreground text-foreground'
                      : 'border-transparent text-muted-foreground hover:border-muted-foreground/50',
                  )}
                  variant="ghost"
                >
                  {item.title}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Navigation */}
          <Sheet onOpenChange={setIsOpen} open={isOpen}>
            <SheetTrigger asChild>
              <Button className="md:hidden" size="icon" variant="ghost">
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[280px] sm:w-[320px]" side="left">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Icon className="text-primary" height="4" width="4" />
                  <span className="bg-linear-to-b from-primary to-primary-foreground bg-clip-text text-xl font-bold text-transparent">
                    YAKU
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-6">
                {siteConfig.mainNav.map(item => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      className={cn(
                        'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground',
                      )}
                      href={item.href}
                      key={item.title}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  )
                })}
              </nav>
              <div className="mt-auto pt-6 border-t">
                <div className="flex items-center gap-3 px-3 py-2">
                  <Avatar className="size-10">
                    <AvatarImage alt={userName} src={userImage || undefined} />
                    <AvatarFallback>{getInitials(user?.name || null, userEmail)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground">{userEmail}</p>
                  </div>
                </div>
                <Button
                  className="w-full mt-4 text-red-600 hover:text-red-600 hover:bg-red-600/10 dark:text-red-500 dark:hover:text-red-500 dark:hover:bg-red-500/10"
                  onClick={handleLogout}
                  variant="ghost"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* User Dropdown (Desktop) */}
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
                  <span>Panel de Control</span>
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
      </div>
    </header>
  )
}
