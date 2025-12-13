import { redirect } from 'next/navigation'
import { AccountInfo } from '@/components/dashboard/account-info'
import { HeaderProfile } from '@/components/dashboard/header-profile'
import { ProgressSection } from '@/components/dashboard/progress-section'
import { StatsCards } from '@/components/dashboard/stats-cards'
import {
  getCurrentUserService,
  getUserProgressService,
  getUserStatsService,
} from '@/lib/services/user.service'

export default async function DashboardPage() {
  const [userResponse, statsResponse, progressResponse] = await Promise.all([
    getCurrentUserService(),
    getUserStatsService(),
    getUserProgressService(),
  ])

  if (!userResponse.success) {
    redirect('/signin')
  }

  const user = userResponse.data

  const stats = statsResponse.success
    ? statsResponse.data
    : {
        totalEnrollments: 0,
        totalCompletions: 0,
        totalQuizAttempts: 0,
        averageQuizScore: 0,
      }

  const progress =
    progressResponse.success && progressResponse.data.length > 0
      ? progressResponse.data
      : [
          {
            courseId: '',
            courseTitle: 'No hay progreso',
            progress: 0,
            completedModules: 0,
            totalModules: 0,
            completedAt: null,
          },
        ]

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <HeaderProfile email={user.email} image={user.image} name={user.name} />
      <StatsCards stats={stats} />
      <ProgressSection progress={progress} />
      <AccountInfo user={user} />
    </div>
  )
}
