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
      title: 'Catálogo de Cursos',
      href: '/dashboard/courses',
    },
    {
      title: 'Mi progreso',
      href: '/dashboard/progress',
    },
  ],
}
