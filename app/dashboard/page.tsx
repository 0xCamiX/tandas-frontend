import { actions } from '@/app/actions'
import { AccountInfo } from '@/components/dashboard/account-info'
import { HeaderProfile } from '@/components/dashboard/header-profile'
import { ProgressSection } from '@/components/dashboard/progress-section'
import { StatsCards } from '@/components/dashboard/stats-cards'

export default async function DashboardPage() {
  const [user, stats, progress] = await Promise.all([
    actions.user.getCurrentUserAction(),
    actions.user.getUserStatsAction(),
    actions.user.getUserProgressAction(),
  ])

  if (!user) {
    return <div>Error al cargar los datos del usuario</div>
  }

  const mockStats = stats || {
    totalEnrollments: 1,
    totalCompletions: 0,
    totalQuizAttempts: 0,
    averageQuizScore: 0,
  }

  const mockProgress =
    progress.length > 0
      ? progress
      : [
          {
            courseId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            courseTitle: 'Sedimentación',
            progress: 75.5,
            completedModules: 3,
            totalModules: 4,
            completedAt: null,
          },
        ]

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <HeaderProfile email={user.email} image={user.image} name={user.name} />
      <StatsCards stats={mockStats} />
      <ProgressSection progress={mockProgress} />
      <AccountInfo user={user} />
    </div>
  )
}
