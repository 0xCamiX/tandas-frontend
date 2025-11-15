'use server'

import {
  getCurrentUserService,
  getUserProgressService,
  getUserStatsService,
} from '@/lib/services/user.service'
import type { CourseProgress, User, UserStats } from '@/lib/types'

export async function getCurrentUserAction(): Promise<User | null> {
  try {
    const response = await getCurrentUserService()

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
    const response = await getUserStatsService()

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
    const response = await getUserProgressService()

    if (response.success) {
      return response.data
    }

    return []
  } catch {
    return []
  }
}
