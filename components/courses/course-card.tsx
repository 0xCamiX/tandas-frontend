import { BookOpen, GraduationCap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Course, CourseLevel } from '@/lib/types'
import { cn } from '@/lib/utils'

type CourseCardProps = {
  course: Course
}

const levelLabels: Record<CourseLevel, string> = {
  BEGINNER: 'Principiante',
  INTERMEDIATE: 'Intermedio',
  ADVANCED: 'Avanzado',
}

const levelColors: Record<CourseLevel, string> = {
  BEGINNER: 'bg-green-500/10 text-green-700 dark:text-green-400',
  INTERMEDIATE: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  ADVANCED: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {course.imageUrl ? (
          <Image alt={course.title} className="object-cover" fill src={course.imageUrl} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 flex-1 text-lg">{course.title}</CardTitle>
          <Badge className={cn('shrink-0', levelColors[course.level])} variant="outline">
            {levelLabels[course.level]}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <GraduationCap className="h-4 w-4" />
          <span className="capitalize">{course.category}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/dashboard/courses/${course.id}`}>Ver Curso</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
