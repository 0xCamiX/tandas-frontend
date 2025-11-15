import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

const protectedRoutes = [
  '/dashboard',
]

function checkIsProtectedRoute(path: string) {
  return protectedRoutes.includes(path)
}

export async function proxy(request: NextRequest) {
  const currentPath = request.nextUrl.pathname

  const isProtectedRoute = checkIsProtectedRoute(currentPath)

  if (!isProtectedRoute) return NextResponse.next()

  // la ruta, es una ruta protegida, por lo que debemos verificar si el usuario está autenticado
  try {
    // 1. validat si el usuario tiene el token jwt
    // 2. si el usuario existe en la base de datos
    // 3. si el usuario esta activo (Bloqueado?)

    const cookieStore = await cookies()
    const jwt = cookieStore.get('jwt')?.value

    if (!jwt) {
      return NextResponse.redirect(new URL('signin', request.url))
    }

    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/users/me`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.redirect(new URL('signin', request.url))
    }

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/signin', request.url))
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/dashboard',
    '/dashboard/:path*',
  ],
}
