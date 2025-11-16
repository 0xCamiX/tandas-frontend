/**
 * Utilidades para invalidar cache según las prácticas modernas de Next.js 16
 * @see https://nextjs.org/docs/app/getting-started/caching-and-revalidating
 */

import { revalidateTag, updateTag } from 'next/cache'

/**
 * Revalida cache usando stale-while-revalidate (recomendado)
 * Sirve contenido stale mientras obtiene contenido fresco en background
 */
export function revalidateUserCache() {
  revalidateTag('user-profile', 'max')
  revalidateTag('user-stats', 'max')
  revalidateTag('user-progress', 'max')
}

/**
 * Expira cache inmediatamente (para Server Actions - read-your-own-writes)
 * Úsalo cuando el usuario actualiza sus propios datos y necesita verlos inmediatamente
 */
export function expireUserCache() {
  updateTag('user-profile')
  updateTag('user-stats')
  updateTag('user-progress')
}
