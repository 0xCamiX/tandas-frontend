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
}

export interface LoginUserData {
  email: string
  password: string
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
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

export enum CourseLevel {
  INICIAL = 'INICIAL',
  MEDIO = 'MEDIO',
  AVANZADO = 'AVANZADO',
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

export type CourseModule = {
  id: string
  title: string
  order: number
  duration: number
}

export type CourseWithModules = Course & {
  modules: CourseModule[]
}

export type QuizOption = {
  id: string
  optionText: string
  isCorrect: boolean
  order: number
}

export type Quiz = {
  id: string
  moduleId: string
  question: string
  type: 'MULTIPLE_CHOICE'
  explanation: string | null
  createdAt: string
  updatedAt: string
}

export type QuizWithOptions = Quiz & {
  options: QuizOption[]
}

export type QuizAttempt = {
  id: string
  quizId: string
  userId: string
  score: number | null
  createdAt: string
  updatedAt: string
}

export type Module = {
  id: string
  courseId: string
  title: string
  content: string | null
  videoUrl: string | null
  order: number
  duration: number | null
  createdAt: string
  updatedAt: string
}

export type ModuleResource = {
  id: string
  resourceType: string
  url: string
  title: string | null
}

export type ModuleWithRelations = Module & {
  course: {
    id: string
    title: string
  }
  quizzes: Quiz[]
  resources: ModuleResource[]
}

export type ModuleCompletion = {
  id: string
  moduleId: string
  userId: string
  completedAt: string
  createdAt: string
  updatedAt: string
}
