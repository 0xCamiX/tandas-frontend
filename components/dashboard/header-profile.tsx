import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type HeaderProfileProps = {
  name: string | null
  email: string
  image: string | null
}

export function HeaderProfile({ name, email, image }: HeaderProfileProps) {
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

  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-16">
        <AvatarImage alt={name || email} src={image || undefined} />
        <AvatarFallback className="text-lg">{getInitials(name, email)}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold">{name || 'Usuario'}</h1>
        <p className="text-muted-foreground">{email}</p>
      </div>
    </div>
  )
}
