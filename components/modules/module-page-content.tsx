import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  Download,
  FileText,
  Layers,
  Video,
} from 'lucide-react'
import Link from 'next/link'
import { ModuleContentTab } from '@/components/modules/module-content-tab'
import { ModuleQuizTab } from '@/components/modules/module-quiz-tab'
import { ModuleSidebar } from '@/components/modules/module-sidebar'
import { ModuleVideoTab } from '@/components/modules/module-video-tab'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type {
  CourseModule,
  CourseWithModules,
  ModuleResource,
  ModuleWithRelations,
  QuizWithOptions,
} from '@/lib/types'

type ModulePageContentProps = {
  course: CourseWithModules
  module: ModuleWithRelations
  quizzes: QuizWithOptions[]
  navigation: {
    prevModule: CourseModule | null
    nextModule: CourseModule | null
    position: number | null
    totalModules: number
  }
  courseId: string
  currentModuleId: string
}

export function ModulePageContent({
  course,
  module,
  quizzes,
  navigation,
  courseId,
  currentModuleId,
}: ModulePageContentProps) {
  const { prevModule, nextModule, position, totalModules } = navigation

  return (
    <div className="container py-8">
      <ModuleNavigation
        courseId={courseId}
        nextModuleId={nextModule?.id}
        prevModuleId={prevModule?.id}
      />

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <ModuleHero
            courseCategory={course.category}
            courseLevel={course.level}
            module={module}
            position={position}
            totalModules={totalModules}
          />

          <ModuleTabsSection module={module} quizzes={quizzes} />

          <ModuleResourcesSection resources={module.resources} />

          <ModuleDownloadsSection module={module} />
        </div>

        <div className="space-y-6">
          <ModuleInfoCard
            courseTitle={course.title}
            module={module}
            position={position}
            totalModules={totalModules}
          />
          <ModuleSidebar course={course} currentModuleId={currentModuleId} />
        </div>
      </div>
    </div>
  )
}

type ModuleNavigationProps = {
  courseId: string
  prevModuleId: string | undefined
  nextModuleId: string | undefined
}

function ModuleNavigation({ courseId, prevModuleId, nextModuleId }: ModuleNavigationProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <Link href={`/dashboard/courses/${courseId}`}>
        <Button size="sm" variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al curso
        </Button>
      </Link>

      <div className="flex items-center gap-2">
        {prevModuleId && (
          <Link href={`/dashboard/courses/${courseId}/${prevModuleId}`}>
            <Button size="sm" variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Módulo anterior
            </Button>
          </Link>
        )}

        {nextModuleId && (
          <Link href={`/dashboard/courses/${courseId}/${nextModuleId}`}>
            <Button size="sm" variant="outline">
              Módulo siguiente
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

type ModuleHeroProps = {
  module: ModuleWithRelations
  position: number | null
  totalModules: number
  courseCategory: string
  courseLevel: string
}

function ModuleHero({
  module,
  position,
  totalModules,
  courseCategory,
  courseLevel,
}: ModuleHeroProps) {
  const cleanContent = module.content ? module.content.replace(/<[^>]*>/g, '') : null
  const summary =
    cleanContent && cleanContent.length > 0 ? `${cleanContent.substring(0, 180)}...` : null

  const metadata = [
    {
      label: 'Duración',
      value: module.duration ? `${module.duration} minutos` : 'No especificada',
      icon: Clock,
    },
    {
      label: 'Progreso',
      value:
        position && totalModules ? `Módulo ${position} de ${totalModules}` : 'Orden no disponible',
      icon: Layers,
    },
    {
      label: 'Categoría',
      value: courseCategory,
      icon: BookOpen,
    },
  ]

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Nivel: {translateLevel(courseLevel)}</Badge>
          {position && (
            <Badge variant="outline">
              Orden: {position} / {totalModules || 'N/A'}
            </Badge>
          )}
        </div>
        <div>
          <CardTitle className="text-3xl">{module.title}</CardTitle>
          {summary && <CardDescription className="mt-3">{summary}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {metadata.map(item => (
            <div className="flex items-center gap-3 rounded-lg border p-4" key={item.label}>
              <item.icon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

type ModuleTabsSectionProps = {
  module: ModuleWithRelations
  quizzes: QuizWithOptions[]
}

function ModuleTabsSection({ module, quizzes }: ModuleTabsSectionProps) {
  const defaultTab = module.videoUrl ? 'video' : 'content'

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>Contenido del módulo</CardTitle>
        <CardDescription>Explora el video, el contenido teórico y la evaluación</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue={defaultTab}>
          <TabsList className={`grid w-full ${module.videoUrl ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {module.videoUrl && <TabsTrigger value="video">Video</TabsTrigger>}
            <TabsTrigger value="content">Contenido</TabsTrigger>
            <TabsTrigger disabled={quizzes.length === 0} value="quiz">
              Evaluación
            </TabsTrigger>
          </TabsList>

          {module.videoUrl && (
            <TabsContent className="mt-6" value="video">
              <ModuleVideoTab module={module} />
            </TabsContent>
          )}

          <TabsContent className="mt-6" value="content">
            <ModuleContentTab module={module} />
          </TabsContent>

          <TabsContent className="mt-6" value="quiz">
            <ModuleQuizTab quizzes={quizzes} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

type ModuleResourcesSectionProps = {
  resources: ModuleResource[]
}

function ModuleResourcesSection({ resources }: ModuleResourcesSectionProps) {
  if (!resources || resources.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recursos complementarios</CardTitle>
          <CardDescription>No hay recursos disponibles para este módulo</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recursos complementarios</CardTitle>
        <CardDescription>Material de apoyo para reforzar lo aprendido</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {resources.map(resource => (
          <div className="flex items-start gap-3 rounded-lg border p-4" key={resource.id}>
            <FileText className="mt-1 h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="font-medium">{resource.title ?? 'Recurso sin título'}</p>
              <p className="text-sm text-muted-foreground">{resource.resourceType}</p>
            </div>
            <Button asChild variant="outline">
              <a href={resource.url} rel="noopener noreferrer" target="_blank">
                Ver recurso
              </a>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

type ModuleDownloadsSectionProps = {
  module: ModuleWithRelations
}

function ModuleDownloadsSection({ module }: ModuleDownloadsSectionProps) {
  const hasDownloads = Boolean(module.videoUrl) || (module.resources ?? []).length > 0

  if (!hasDownloads) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contenido disponible sin conexión</CardTitle>
        <CardDescription>
          Descarga el material del módulo para consultarlo cuando quieras
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {module.videoUrl && (
          <DownloadRow
            description="Archivo de video MP4"
            href={module.videoUrl}
            icon={Video}
            label="Video del módulo"
          />
        )}
        {module.resources.map(resource => (
          <DownloadRow
            description={resource.resourceType}
            href={resource.url}
            icon={Download}
            key={resource.id}
            label={resource.title ?? 'Recurso descargable'}
          />
        ))}
      </CardContent>
    </Card>
  )
}

type DownloadRowProps = {
  icon: typeof Download
  label: string
  description: string
  href: string
}

function DownloadRow({ icon: Icon, label, description, href }: DownloadRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-4">
      <Icon className="h-5 w-5 text-primary" />
      <div className="flex-1">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button asChild variant="secondary">
        <a href={href} rel="noopener noreferrer" target="_blank">
          Descargar
        </a>
      </Button>
    </div>
  )
}

type ModuleInfoCardProps = {
  module: ModuleWithRelations
  position: number | null
  totalModules: number
  courseTitle: string
}

function ModuleInfoCard({ module, position, totalModules, courseTitle }: ModuleInfoCardProps) {
  const info = [
    {
      label: 'Curso',
      value: courseTitle,
    },
    {
      label: 'Orden del módulo',
      value:
        position && totalModules ? `Módulo ${position} de ${totalModules}` : 'Orden no disponible',
    },
    {
      label: 'Duración estimada',
      value: module.duration ? `${module.duration} minutos` : 'No especificada',
    },
    {
      label: 'Recursos',
      value: `${module.resources?.length ?? 0} recursos asociados`,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen del módulo</CardTitle>
        <CardDescription>Detalle rápido de la lección</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {info.map(item => (
          <div className="rounded-lg bg-muted/60 p-4" key={item.label}>
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="font-medium">{item.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function translateLevel(level: string) {
  const mapping: Record<string, string> = {
    BEGINNER: 'Principiante',
    INTERMEDIATE: 'Intermedio',
    ADVANCED: 'Avanzado',
  }

  return mapping[level] ?? level
}
