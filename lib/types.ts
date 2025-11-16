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

export enum CourseStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export type Course = {
  id: string
  title: string
  description: string
  imageUrl: string | null
  category: string
  level: CourseLevel
  status: CourseStatus
  createdAt: string
  updatedAt: string
}

export type CourseCategory =
  | 'sedimentación'
  | 'filtración'
  | 'almacenamiento seguro'
  | 'desinfección'
