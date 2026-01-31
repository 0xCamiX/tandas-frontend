import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icons/icon'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { siteConfig } from '@/config/site'

export function Navbar() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link className="flex items-center gap-2 hover:opacity-80 transition-opacity" href="/">
          <Icon className="text-primary" height="4" width="4" />
          <h1 className="hidden sm:block bg-linear-to-b from-primary to-primary-foreground bg-clip-text text-2xl font-bold text-transparent">
            YAKU
          </h1>
          <span className="sr-only">YAKU</span>
        </Link>
        <nav className="flex items-center gap-2">
          <ThemeToggle />
          {siteConfig.landingNav.map(item => (
            <Link href={item.href} key={item.title}>
              <Button
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                variant="outline"
              >
                {item.title}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
