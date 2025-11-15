export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'TANDAS',
  description:
    'Plataforma interactiva de aprendizaje de los métodos de pretratamiento de agua en el hogar',
  landingNav: [
    {
      title: 'Iniciar sesión',
      href: '/login',
    },
    {
      title: 'Registrarse',
      href: '/register',
    },
  ],
  mainNav: [
    {
      title: 'Inicio',
      href: '/',
    },
    {
      title: 'Cursos',
      href: '/cursos',
    },
    {
      title: 'Perfil',
      href: '/profile',
    },
  ],
}
