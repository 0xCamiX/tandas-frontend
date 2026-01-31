import { Award, BookOpen, CheckCircle, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { UserStats } from '@/lib/types'

type StatsCardsProps = {
  stats: UserStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const normalizePercent = (value: number) => (value <= 1 ? value * 100 : value)
  const averageScore = normalizePercent(stats.averageQuizScore)

  const statsData = [
    {
      title: 'Inscripciones',
      value: stats.totalEnrollments,
      description: 'Cursos en los que estás inscrito',
      icon: BookOpen,
      color: 'bg-primary',
      iconColor: 'text-primary-foreground',
    },
    {
      title: 'Completados',
      value: stats.totalCompletions,
      description: 'Cursos completados exitosamente',
      icon: CheckCircle,
      color: 'bg-green-500',
      iconColor: 'text-white',
    },
    {
      title: 'Intentos de Quiz',
      value: stats.totalQuizAttempts,
      description: 'Total de quizzes realizados',
      icon: Award,
      color: 'bg-blue-500',
      iconColor: 'text-white',
    },
    {
      title: 'Puntuación Promedio',
      value: `${averageScore.toFixed(1)}%`,
      description: 'Promedio de tus calificaciones',
      icon: TrendingUp,
      color: 'bg-purple-500',
      iconColor: 'text-white',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map(stat => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="pb-3">
              <div
                className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-3`}
              >
                <Icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <CardTitle className="text-2xl font-bold">{stat.value}</CardTitle>
              <CardDescription className="text-sm">{stat.title}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
