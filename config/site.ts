export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'TANDAS',
  description:
    'Plataforma interactiva de aprendizaje de los métodos de pretratamiento de agua en el hogar',
  landingNav: [
    {
      title: 'Iniciar sesión',
      href: '/signin',
    },
    {
      title: 'Registrarse',
      href: '/signup',
    },
  ],
  mainNav: [
    {
      title: 'Inicio',
      href: '/',
    },
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
    {
      title: 'Perfil',
      href: '/dashboard/profile',
    },
    {
      title: 'Cursos',
      href: '/dashboard/courses',
    },
  ],
}
