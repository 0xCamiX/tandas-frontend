import { BookOpen } from 'lucide-react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { CourseWithModules } from '@/lib/types'
import { cn } from '@/lib/utils'

type CourseDetailHeaderProps = {
  course: CourseWithModules
}

const levelColors: Record<string, string> = {
  BEGINNER: 'bg-green-500/10 text-green-700 dark:text-green-400',
  INTERMEDIATE: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  ADVANCED: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
}

const levelLabels: Record<string, string> = {
  BEGINNER: 'Principiante',
  INTERMEDIATE: 'Intermedio',
  ADVANCED: 'Avanzado',
}

export function CourseDetailHeader({ course }: CourseDetailHeaderProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <div className="relative h-64 w-full overflow-hidden bg-muted md:h-80">
        {course.imageUrl ? (
          <Image alt={course.title} className="object-cover" fill src={course.imageUrl} />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <BookOpen className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
      </div>
      <CardContent className="px-6 pt-6 pb-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">{course.title}</h1>
            <Badge className={cn('shrink-0', levelColors[course.level])} variant="outline">
              {levelLabels[course.level]}
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground capitalize">{course.category}</p>
        </div>
      </CardContent>
    </Card>
  )
}
