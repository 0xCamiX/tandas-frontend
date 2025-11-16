export type User = {
  id: string
  email: string
  name: string | null
  image: string | null
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface RegisterUserData {
  username: string
  email: string
  password: string
  callbackUrl: string
}

export interface LoginUserData {
  email: string
  password: string
  callbackURL: string
}

export type UserStats = {
  totalEnrollments: number
  totalCompletions: number
  totalQuizAttempts: number
  averageQuizScore: number
}

export type CourseProgress = {
  courseId: string
  courseTitle: string
  progress: number
  completedModules: number
  totalModules: number
  completedAt: string | null
}
