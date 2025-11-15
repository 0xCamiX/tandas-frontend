'use server'

import { cookies } from 'next/headers'
import type { CourseProgress, User, UserStats } from '@/lib/api'
import { getCurrentUserService, getUserProgressService, getUserStatsService } from '@/lib/api'

export async function getCurrentUserAction(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const jwt = cookieStore.get('jwt')?.value

    if (!jwt || !process.env.BACKEND_URL) {
      return null
    }

    const response = await getCurrentUserService(jwt)

    if (response.success) {
      return response.data
    }

    return null
  } catch {
    return null
  }
}

export async function getUserStatsAction(): Promise<UserStats | null> {
  try {
    const cookieStore = await cookies()
    const jwt = cookieStore.get('jwt')?.value

    if (!jwt || !process.env.BACKEND_URL) {
      return null
    }

    const response = await getUserStatsService(jwt)

    if (response.success) {
      return response.data
    }

    return null
  } catch {
    return null
  }
}

export async function getUserProgressAction(): Promise<CourseProgress[]> {
  try {
    const cookieStore = await cookies()
    const jwt = cookieStore.get('jwt')?.value

    if (!jwt || !process.env.BACKEND_URL) {
      return []
    }

    const response = await getUserProgressService(jwt)

    if (response.success) {
      return response.data
    }

    return []
  } catch {
    return []
  }
}
