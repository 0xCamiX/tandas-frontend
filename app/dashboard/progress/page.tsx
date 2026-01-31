import { redirect } from 'next/navigation'
import { ProgressSection } from '@/components/dashboard/progress-section'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { getUserProgressService, getUserStatsService } from '@/lib/services/user.service'

export default async function ProgressPage() {
  const [statsResponse, progressResponse] = await Promise.all([
    getUserStatsService(),
    getUserProgressService(),
  ])

  if (!statsResponse.success && statsResponse.error.code === 'NO_TOKEN') {
    redirect('/signin')
  }

  if (!progressResponse.success && progressResponse.error.code === 'NO_TOKEN') {
    redirect('/signin')
  }

  const stats = statsResponse.success
    ? statsResponse.data
    : {
        totalEnrollments: 0,
        totalCompletions: 0,
        totalQuizAttempts: 0,
        averageQuizScore: 0,
      }

  const progress = progressResponse.success ? progressResponse.data : []

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Mi progreso</h1>
        <p className="text-muted-foreground">
          Consulta tus avances en cada curso y revisa tus estadísticas más recientes.
        </p>
      </div>
      <StatsCards stats={stats} />
      <ProgressSection progress={progress} />
    </div>
  )
}
